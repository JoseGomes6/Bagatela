/* Gerador de conceitos "local" da Bagatela: sem IA, sem servidor, sem custos.
 * Lê a descrição, reconhece o tipo de negócio e o que o cliente precisa (por palavras-chave
 * em PT/EN/FR/ES) e monta um conceito a partir de modelos escritos pela Bagatela.
 * Só usa factos que o cliente escreveu (nome, local); o resto são sugestões.
 * Devolve o mesmo formato JSON que a versão com IA (api/generate-concept.js).
 * Uso: BagatelaLocal.gerar(texto, "pt"|"en"|"fr"|"es") -> objeto ou null (se não parecer um negócio). */
(function (root) {
  "use strict";

  var NOME_PADRAO = "Nome do negócio"; // o frontend traduz este valor

  // ---------- utilitários ----------
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function hasAny(text, list) { for (var i = 0; i < list.length; i++) if (text.indexOf(list[i]) >= 0) return true; return false; }
  function countHits(text, list) { var n = 0; for (var i = 0; i < list.length; i++) if (text.indexOf(list[i]) >= 0) n++; return n; }
  function pick(o, lang) { return o && (o[lang] || o.pt) || ""; }
  function L(pt, en, fr, es) { return { pt: pt, en: en, fr: fr, es: es }; }

  // ---------- categorias: palavras-chave (sem acentos, minúsculas) ----------
  var KEYWORDS = {
    alojamento: ["alojamento", "quarto", "hospede", "hospedagem", "hostel", "pousada", "quinta", "casa de campo", "turismo rural", "airbnb", "booking", "hotel", "guest house", "guesthouse", "b&b", "apartamento turistico", "holiday rental", "bedroom", "rooms", "gite", "chambre", "hebergement", "habitacion", "alojamiento", "casa rural", "hospedaje"],
    restauracao: ["restaurante", "cafe", "pastelaria", "padaria", "tasca", "snack", "pizzaria", "hamburgueria", "ementa", "tapas", "gelataria", "take-away", "takeaway", "restaurant", "brasserie", "bistro", "coffee shop", "bakery", "pratos", "cocina", "cervejaria", "marisqueira", "menu do dia"],
    loja: ["loja", "boutique", "vender", "produtos", "artesanato", "roupa", "calcado", "moda", "livraria", "mercearia", "florista", "shop", "store", "clothing", "tienda", "ropa", "vetements", "catalogo", "coleccao", "colecao"],
    beleza_saude: ["cabeleireiro", "barbeiro", "estetica", "unhas", "manicure", "spa", "massagem", "clinica", "dentista", "fisioterapia", "psicolog", "nutricionista", "veterinari", "optica", "salon", "hairdresser", "barber", "beauty", "nails", "physio", "clinic", "dentist", "coiffeur", "esthetique", "peluqueria", "fisioterapeuta", "bem-estar", "depilacao"],
    servicos: ["canalizador", "eletricista", "pintor", "obras", "construcao", "remodelacao", "carpinteiro", "serralheiro", "mecanico", "oficina", "limpezas", "jardinagem", "transportes", "mudancas", "climatizacao", "instalacao", "reparacoes", "plumber", "electrician", "painter", "builder", "garage", "cleaning", "gardener", "plombier", "electricien", "peintre", "fontanero", "taller"],
    ginasio: ["ginasio", "crossfit", "yoga", "pilates", "personal trainer", "treino", "fitness", "danca", "artes marciais", "natacao", "gym", "entrenador", "salle de sport", "coach sportif", "academia", "aulas de grupo"],
    profissional: ["advogado", "contabilista", "arquiteto", "engenheiro", "consultor", "consultoria", "seguros", "imobiliaria", "mediador", "agencia", "formacao", "explicacoes", "lawyer", "accountant", "architect", "consultant", "real estate", "tutor", "avocat", "comptable", "architecte", "abogado", "contable", "arquitecto", "inmobiliaria", "gestoria"],
    criativo: ["fotografo", "fotografia de", "video", "designer", "ilustrador", "musico", "banda", "artista", "portfolio", "portefolio", "atelier", "tatuador", "casamentos", "eventos", "photographer", "filmmaker", "illustrator", "musician", "artist", "tattoo", "photographe", "graphiste"]
  };
  var PRIORIDADE = ["alojamento", "restauracao", "beleza_saude", "ginasio", "servicos", "profissional", "criativo", "loja"];

  // ---------- sinais do que o cliente pede ----------
  var SINAIS = {
    ecommerce: ["carrinho", "checkout", "loja online", "e-commerce", "ecommerce", "vender online", "vendas online", "venda online", "pagamentos online", "pagamento online", "comprar online", "encomendas online", "encomenda online", "vender por internet", "vender na internet", "online store", "online shop", "shopping cart", "sell online", "selling online", "boutique en ligne", "panier", "vendre en ligne", "tienda online", "carrito", "vender por internet"],
    galeria: ["foto", "galeria", "imagens", "gallery", "photo", "galerie", "fotograf"],
    formulario: ["formulario", "contact form", "formulaire", "pedido de contacto"],
    reservas: ["reserv", "booking", "marcacao", "marcacoes", "marcar", "agendar", "agenda", "appointment", "rendez-vous", "cita", "book a", "book "],
    mapa: ["localizacao", "mapa", "morada", "onde estamos", "como chegar", "location", "map", "address", "localisation", "ubicacion", "direccion", "centro de", "no centro"],
    seccoes: ["sobre nos", "historia", "equipa", "team", "about us", "servicos", "varias secoes", "varias paginas", "paginas", "secoes", "pages", "sections"],
    integracoes: ["instagram", "facebook", "redes sociais", "social media", "newsletter", "tripadvisor", "calendario", "whatsapp", "google maps"],
    avaliacoes: ["avaliacoes", "reviews", "testemunhos", "opinioes", "testimonials", "avis", "opiniones"],
    multilingue: ["ingles", "english", "frances", "turistas", "estrangeiros", "tourists", "international", "touristes"],
    simples: ["pagina simples", "uma pagina", "apenas uma pagina", "so uma pagina", "one page", "simple page", "single page", "page simple", "pagina sencilla", "una pagina"],
    blog: ["blog", "artigos", "noticias", "news"],
    menu: ["menu", "ementa", "carta", "pratos"]
  };
  var INTENCAO = ["tenho", "temos", "quero", "queremos", "preciso", "precisamos", "gostava", "gostavamos", "i have", "we have", "i want", "we want", "i need", "we need", "i run", "we run", "j'ai", "nous avons", "je veux", "nous voulons", "tengo", "tenemos", "quiero", "queremos", "necesito", "negocio", "empresa", "business", "entreprise", "site", "website", "pagina", "web", "clientes", "customers", "clients"];

  // ---------- biblioteca de secções ----------
  var SEC = {
    hero: [L("Hero", "Hero", "Hero", "Hero"), L("Imagem de destaque, headline e botão principal.", "Standout image, headline and main button.", "Visuel d'accroche, titre et bouton principal.", "Imagen destacada, titular y botón principal.")],
    sobre: [L("Sobre nós", "About us", "À propos", "Sobre nosotros"), L("A história do negócio e o que o distingue.", "The story of the business and what sets it apart.", "L'histoire de l'activité et ce qui la distingue.", "La historia del negocio y lo que lo distingue.")],
    quartos: [L("Alojamento", "Accommodation", "Hébergement", "Alojamiento"), L("Os quartos e os espaços, com fotografias e informação útil.", "The rooms and spaces, with photos and useful information.", "Les chambres et les espaces, avec photos et informations utiles.", "Las habitaciones y los espacios, con fotografías e información útil.")],
    galeria: [L("Galeria", "Gallery", "Galerie", "Galería"), L("Fotografias que mostram o ambiente e os detalhes.", "Photos that show the atmosphere and the details.", "Des photos qui montrent l'ambiance et les détails.", "Fotografías que muestran el ambiente y los detalles.")],
    experiencias: [L("Experiências", "Experiences", "Expériences", "Experiencias"), L("O que fazer na zona e o que torna a estadia especial.", "What to do nearby and what makes a stay special.", "Que faire dans les environs et ce qui rend le séjour spécial.", "Qué hacer en la zona y qué hace especial la estancia.")],
    localizacao: [L("Localização", "Location", "Localisation", "Ubicación"), L("Mapa, morada e como chegar.", "Map, address and how to get there.", "Plan, adresse et comment venir.", "Mapa, dirección y cómo llegar.")],
    contactos: [L("Contactos", "Contact", "Contact", "Contacto"), L("Formulário, telefone e formas rápidas de falar convosco.", "Form, phone and quick ways to get in touch.", "Formulaire, téléphone et moyens rapides de vous joindre.", "Formulario, teléfono y formas rápidas de contactar.")],
    menu: [L("Menu", "Menu", "Carte", "Carta"), L("Pratos, bebidas e preços, fáceis de ler no telemóvel.", "Dishes, drinks and prices, easy to read on a phone.", "Plats, boissons et prix, faciles à lire sur mobile.", "Platos, bebidas y precios, fáciles de leer en el móvil.")],
    reservas: [L("Reservas", "Bookings", "Réservations", "Reservas"), L("Pedido de reserva por formulário, telefone ou WhatsApp.", "Booking requests by form, phone or WhatsApp.", "Demande de réservation par formulaire, téléphone ou WhatsApp.", "Solicitud de reserva por formulario, teléfono o WhatsApp.")],
    servicos: [L("Serviços", "Services", "Services", "Servicios"), L("O que fazem, explicado de forma clara e simples.", "What you do, explained clearly and simply.", "Ce que vous faites, expliqué simplement.", "Lo que hacéis, explicado de forma clara y sencilla.")],
    precos: [L("Preços", "Pricing", "Tarifs", "Precios"), L("Tabela de preços simples e transparente.", "A simple, transparent price list.", "Une grille de tarifs simple et transparente.", "Una tabla de precios simple y transparente.")],
    equipa: [L("Equipa", "Team", "Équipe", "Equipo"), L("As pessoas por trás do negócio, para criar confiança.", "The people behind the business, to build trust.", "Les personnes derrière l'activité, pour inspirer confiance.", "Las personas detrás del negocio, para generar confianza.")],
    avaliacoes: [L("Opiniões", "Reviews", "Avis", "Opiniones"), L("Espaço para avaliações e testemunhos de clientes.", "Space for customer reviews and testimonials.", "Un espace pour les avis et témoignages de clients.", "Espacio para valoraciones y testimonios de clientes.")],
    catalogo: [L("Catálogo", "Catalogue", "Catalogue", "Catálogo"), L("Produtos organizados por categorias, com fotografia e preço.", "Products organised by category, with photo and price.", "Produits classés par catégorie, avec photo et prix.", "Productos organizados por categorías, con foto y precio.")],
    destaques: [L("Destaques", "Highlights", "Nouveautés", "Destacados"), L("Novidades e produtos em destaque.", "New arrivals and featured products.", "Nouveautés et produits à l'honneur.", "Novedades y productos destacados.")],
    faq: [L("Perguntas frequentes", "FAQ", "FAQ", "Preguntas frecuentes"), L("Respostas às dúvidas mais comuns antes de comprar ou contactar.", "Answers to the most common questions before buying or getting in touch.", "Réponses aux questions courantes avant d'acheter ou de contacter.", "Respuestas a las dudas más comunes antes de comprar o contactar.")],
    portfolio: [L("Portefólio", "Portfolio", "Portfolio", "Portafolio"), L("Os melhores trabalhos, com imagens grandes.", "The best work, shown in large images.", "Les meilleures réalisations en grandes images.", "Los mejores trabajos, con imágenes grandes.")],
    processo: [L("Como trabalhamos", "How we work", "Notre façon de travailler", "Cómo trabajamos"), L("Os passos, do primeiro contacto ao resultado final.", "The steps, from first contact to the final result.", "Les étapes, du premier contact au résultat final.", "Los pasos, desde el primer contacto hasta el resultado final.")],
    marcacoes: [L("Marcações", "Appointments", "Rendez-vous", "Citas"), L("Pedido de marcação simples, por formulário ou telefone.", "Simple appointment requests by form or phone.", "Demande de rendez-vous simple, par formulaire ou téléphone.", "Solicitud de cita sencilla, por formulario o teléfono.")],
    horarios: [L("Horários", "Opening hours", "Horaires", "Horarios"), L("Horário de funcionamento e de aulas ou atendimento.", "Opening hours and class or service times.", "Horaires d'ouverture, de cours ou d'accueil.", "Horario de apertura y de clases o atención.")],
    planos: [L("Planos", "Memberships", "Abonnements", "Tarifas"), L("Modalidades e preços, fáceis de escolher.", "Options and prices, easy to choose from.", "Formules et tarifs, faciles à choisir.", "Modalidades y precios, fáciles de elegir.")],
    zonas: [L("Zonas de serviço", "Service areas", "Zones d'intervention", "Zonas de servicio"), L("Onde trabalham e como pedir ajuda rápida.", "Where you work and how to ask for quick help.", "Où vous intervenez et comment demander de l'aide rapidement.", "Dónde trabajáis y cómo pedir ayuda rápida.")]
  };

  // ---------- biblioteca de funcionalidades ----------
  var FN = {
    galeria_fotos: L("Galeria de fotografias", "Photo gallery", "Galerie photo", "Galería de fotografías"),
    mapa: L("Google Maps", "Google Maps", "Google Maps", "Google Maps"),
    formulario: L("Formulário de contacto", "Contact form", "Formulaire de contact", "Formulario de contacto"),
    whatsapp: L("Botão de WhatsApp e de chamada", "WhatsApp and call buttons", "Boutons WhatsApp et d'appel", "Botones de WhatsApp y de llamada"),
    reservas_form: L("Pedido de reserva por formulário", "Booking request form", "Formulaire de demande de réservation", "Formulario de solicitud de reserva"),
    booking: L("Ligação a plataformas de reservas (ex.: Booking)", "Link to booking platforms (e.g. Booking)", "Lien vers les plateformes de réservation (ex. : Booking)", "Enlace a plataformas de reservas (p. ej.: Booking)"),
    marcacoes_form: L("Pedido de marcação online", "Online appointment requests", "Demande de rendez-vous en ligne", "Solicitud de cita online"),
    menu_online: L("Menu sempre atualizado", "Always up-to-date menu", "Carte toujours à jour", "Carta siempre actualizada"),
    catalogo: L("Catálogo de produtos", "Product catalogue", "Catalogue de produits", "Catálogo de productos"),
    carrinho: L("Carrinho de compras e checkout", "Shopping cart and checkout", "Panier et paiement", "Carrito de compra y pago"),
    pagamentos: L("Pagamentos por MB WAY, Multibanco e cartão", "MB WAY, Multibanco and card payments", "Paiements par MB WAY, Multibanco et carte", "Pagos con MB WAY, Multibanco y tarjeta"),
    redes: L("Ligação às redes sociais", "Social media links", "Liens vers les réseaux sociaux", "Enlaces a redes sociales"),
    seo: L("SEO local para ser encontrado no Google", "Local SEO to be found on Google", "SEO local pour être trouvé sur Google", "SEO local para que te encuentren en Google"),
    perfil_google: L("Perfil de Empresa no Google", "Google Business Profile", "Fiche Google Business", "Perfil de Empresa en Google"),
    multilingue: L("Versão noutro idioma", "Version in another language", "Version dans une autre langue", "Versión en otro idioma"),
    avaliacoes_f: L("Espaço para avaliações de clientes", "Space for customer reviews", "Espace pour les avis clients", "Espacio para valoraciones de clientes"),
    horarios_f: L("Horários sempre à vista", "Opening hours always visible", "Horaires toujours visibles", "Horarios siempre a la vista"),
    portfolio_f: L("Portefólio com imagens grandes", "Portfolio with large images", "Portfolio en grandes images", "Portafolio con imágenes grandes"),
    blog_f: L("Secção de notícias ou artigos", "News or articles section", "Section actualités ou articles", "Sección de noticias o artículos")
  };

  // ---------- categorias: conteúdo ----------
  var CAT = {
    alojamento: {
      type: L("Alojamento Local", "Holiday rental", "Hébergement touristique", "Alojamiento turístico"),
      objective: L("Apresentar o espaço, os quartos e a experiência da estadia, facilitando o contacto e as reservas.", "Showcase the property, the rooms and the stay experience, making it easy to get in touch and book.", "Présenter le lieu, les chambres et l'expérience du séjour, en facilitant le contact et les réservations.", "Presentar el espacio, las habitaciones y la experiencia de la estancia, facilitando el contacto y las reservas."),
      audience: L("Viajantes, casais e famílias que procuram um sítio acolhedor para ficar.", "Travellers, couples and families looking for a welcoming place to stay.", "Voyageurs, couples et familles qui cherchent un lieu accueillant pour séjourner.", "Viajeros, parejas y familias que buscan un lugar acogedor donde alojarse."),
      visual: L("Acolhedora e elegante, com fotografias grandes, muito espaço em branco e cores naturais inspiradas no local.", "Warm and elegant, with large photos, plenty of white space and natural colours inspired by the place.", "Chaleureuse et élégante, avec de grandes photos, beaucoup d'espace blanc et des couleurs naturelles inspirées du lieu.", "Acogedora y elegante, con fotografías grandes, mucho espacio en blanco y colores naturales inspirados en el lugar."),
      headline: L("Uma experiência única para descansar a sério.", "A unique stay to truly unwind.", "Un séjour unique pour vraiment se ressourcer.", "Una experiencia única para descansar de verdad."),
      headlineLugar: L("Uma experiência única {lugar}.", "A unique stay {lugar}.", "Un séjour unique {lugar}.", "Una experiencia única {lugar}."),
      cta: L("Pedir reserva", "Request a booking", "Demander une réservation", "Pedir reserva"),
      sections: ["hero", "sobre", "quartos", "galeria", "experiencias", "localizacao", "contactos"],
      features: ["galeria_fotos", "booking", "mapa", "formulario", "seo"]
    },
    restauracao: {
      type: L("Restauração", "Restaurant", "Restauration", "Restauración"),
      objective: L("Mostrar o menu, o ambiente e a localização, e facilitar as reservas.", "Show the menu, the atmosphere and the location, and make bookings easy.", "Présenter la carte, l'ambiance et l'adresse, et faciliter les réservations.", "Mostrar la carta, el ambiente y la ubicación, y facilitar las reservas."),
      audience: L("Moradores, trabalhadores e turistas à procura de um bom sítio para comer.", "Locals, workers and visitors looking for a good place to eat.", "Habitants, actifs et visiteurs à la recherche d'une bonne table.", "Vecinos, trabajadores y visitantes que buscan un buen sitio para comer."),
      visual: L("Apetitosa e calorosa, com fotografias de pratos em grande, tipografia com carácter e cores quentes.", "Appetising and warm, with large dish photos, characterful typography and warm colours.", "Appétissante et chaleureuse, avec de grandes photos de plats, une typographie de caractère et des couleurs chaudes.", "Apetitosa y cálida, con fotografías grandes de platos, tipografía con carácter y colores cálidos."),
      headline: L("Bom de ver, melhor de provar.", "Good to look at, even better to taste.", "Beau à voir, encore meilleur à goûter.", "Bonito de ver, mejor de probar."),
      headlineLugar: L("Bom de ver, melhor de provar {lugar}.", "Good to look at, even better to taste {lugar}.", "Beau à voir, encore meilleur à goûter {lugar}.", "Bonito de ver, mejor de probar {lugar}."),
      cta: L("Ver o menu", "See the menu", "Voir la carte", "Ver la carta"),
      sections: ["hero", "menu", "sobre", "galeria", "reservas", "localizacao", "contactos"],
      features: ["menu_online", "galeria_fotos", "reservas_form", "mapa", "horarios_f"]
    },
    loja: {
      type: L("Loja", "Shop", "Boutique", "Tienda"),
      objective: L("Mostrar os produtos e levar as pessoas a visitar a loja ou a comprar.", "Show the products and encourage people to visit the shop or buy.", "Présenter les produits et inciter à visiter la boutique ou à acheter.", "Mostrar los productos y animar a visitar la tienda o a comprar."),
      audience: L("Clientes locais e online que procuram produtos com personalidade.", "Local and online customers looking for products with personality.", "Clients locaux et en ligne à la recherche de produits avec de la personnalité.", "Clientes locales y online que buscan productos con personalidad."),
      visual: L("Limpa e luminosa, com os produtos em destaque, fotografias consistentes e uma paleta simples.", "Clean and bright, with products in the spotlight, consistent photos and a simple palette.", "Épurée et lumineuse, avec les produits en vedette, des photos cohérentes et une palette simple.", "Limpia y luminosa, con los productos en primer plano, fotografías coherentes y una paleta sencilla."),
      headline: L("Produtos com personalidade, à distância de um clique.", "Products with personality, one click away.", "Des produits de caractère, à portée de clic.", "Productos con personalidad, a un clic."),
      headlineLugar: L("Produtos com personalidade {lugar}.", "Products with personality {lugar}.", "Des produits de caractère {lugar}.", "Productos con personalidad {lugar}."),
      cta: L("Ver os produtos", "See the products", "Voir les produits", "Ver los productos"),
      sections: ["hero", "catalogo", "sobre", "localizacao", "contactos"],
      sectionsOnline: ["hero", "catalogo", "destaques", "sobre", "faq", "contactos"],
      features: ["catalogo", "galeria_fotos", "mapa", "whatsapp", "redes"],
      featuresOnline: ["catalogo", "carrinho", "pagamentos", "galeria_fotos", "whatsapp", "seo"]
    },
    beleza_saude: {
      type: L("Beleza e Bem-estar", "Beauty & Wellness", "Beauté et bien-être", "Belleza y bienestar"),
      objective: L("Apresentar os serviços e os preços, e facilitar a marcação.", "Present the services and prices, and make booking easy.", "Présenter les services et les tarifs, et faciliter la prise de rendez-vous.", "Presentar los servicios y los precios, y facilitar la reserva de cita."),
      audience: L("Pessoas da zona que querem cuidar de si e procuram um profissional de confiança.", "Local people who want to look after themselves and need a professional they can trust.", "Habitants de la zone qui veulent prendre soin d'eux et cherchent un professionnel de confiance.", "Personas de la zona que quieren cuidarse y buscan un profesional de confianza."),
      visual: L("Serena e cuidada, com tons suaves, fotografias de proximidade e muito espaço para respirar.", "Calm and polished, with soft tones, close-up photography and plenty of room to breathe.", "Sereine et soignée, avec des tons doux, des photos de proximité et beaucoup d'air.", "Serena y cuidada, con tonos suaves, fotografías cercanas y mucho espacio para respirar."),
      headline: L("Cuidamos de ti, ao teu ritmo.", "We take care of you, at your pace.", "On prend soin de vous, à votre rythme.", "Cuidamos de ti, a tu ritmo."),
      cta: L("Marcar agora", "Book now", "Prendre rendez-vous", "Reservar cita"),
      sections: ["hero", "servicos", "precos", "sobre", "avaliacoes", "marcacoes", "localizacao"],
      features: ["marcacoes_form", "mapa", "galeria_fotos", "whatsapp", "perfil_google"]
    },
    servicos: {
      type: L("Serviços técnicos", "Trades & technical services", "Services techniques", "Servicios técnicos"),
      objective: L("Mostrar os serviços e as zonas onde trabalham, e tornar fácil pedir ajuda.", "Show the services and the areas you cover, and make it easy to ask for help.", "Présenter les services et les zones d'intervention, et faciliter la demande d'aide.", "Mostrar los servicios y las zonas donde trabajáis, y facilitar pedir ayuda."),
      audience: L("Particulares e empresas da zona com um problema para resolver depressa.", "Local homeowners and businesses with a problem to solve quickly.", "Particuliers et entreprises de la zone avec un problème à résoudre vite.", "Particulares y empresas de la zona con un problema que resolver rápido."),
      visual: L("Direta e de confiança, com cores fortes, botões de chamada bem visíveis e fotografias de trabalhos reais.", "Direct and trustworthy, with strong colours, highly visible call buttons and photos of real jobs.", "Directe et fiable, avec des couleurs franches, des boutons d'appel bien visibles et des photos de vrais chantiers.", "Directa y de confianza, con colores fuertes, botones de llamada muy visibles y fotografías de trabajos reales."),
      headline: L("Problema resolvido, sem complicações.", "Problem solved, no fuss.", "Problème résolu, sans complications.", "Problema resuelto, sin complicaciones."),
      headlineLugar: L("Problema resolvido {lugar}, sem complicações.", "Problem solved {lugar}, no fuss.", "Problème résolu {lugar}, sans complications.", "Problema resuelto {lugar}, sin complicaciones."),
      cta: L("Pedir contacto", "Get in touch", "Être rappelé", "Pedir contacto"),
      sections: ["hero", "servicos", "zonas", "processo", "sobre", "avaliacoes", "contactos"],
      features: ["whatsapp", "formulario", "mapa", "galeria_fotos", "perfil_google", "seo"]
    },
    ginasio: {
      type: L("Desporto e Fitness", "Sport & Fitness", "Sport et fitness", "Deporte y fitness"),
      objective: L("Mostrar as modalidades, os horários e os planos, e levar as pessoas a experimentar.", "Show the activities, timetable and memberships, and get people to try it.", "Présenter les activités, les horaires et les formules, et donner envie d'essayer.", "Mostrar las modalidades, los horarios y las tarifas, y animar a probar."),
      audience: L("Pessoas que querem mexer-se mais e procuram um espaço motivador perto de si.", "People who want to move more and are looking for a motivating space nearby.", "Personnes qui veulent bouger plus et cherchent un lieu motivant près de chez elles.", "Personas que quieren moverse más y buscan un espacio motivador cerca de casa."),
      visual: L("Enérgica e moderna, com contrastes fortes, fotografias de ação e tipografia grande.", "Energetic and modern, with strong contrasts, action photos and big typography.", "Énergique et moderne, avec de forts contrastes, des photos d'action et une grande typographie.", "Enérgica y moderna, con contrastes fuertes, fotografías de acción y tipografía grande."),
      headline: L("Começa hoje. O teu corpo agradece.", "Start today. Your body will thank you.", "Commencez aujourd'hui. Votre corps vous remerciera.", "Empieza hoy. Tu cuerpo te lo agradecerá."),
      headlineLugar: L("Começa hoje {lugar}. O teu corpo agradece.", "Start today {lugar}. Your body will thank you.", "Commencez aujourd'hui {lugar}. Votre corps vous remerciera.", "Empieza hoy {lugar}. Tu cuerpo te lo agradecerá."),
      cta: L("Experimentar uma aula", "Try a class", "Essayer un cours", "Probar una clase"),
      sections: ["hero", "servicos", "horarios", "planos", "equipa", "galeria", "contactos"],
      features: ["horarios_f", "marcacoes_form", "galeria_fotos", "whatsapp", "mapa"]
    },
    profissional: {
      type: L("Serviços profissionais", "Professional services", "Services professionnels", "Servicios profesionales"),
      objective: L("Transmitir confiança, explicar os serviços e levar as pessoas a entrar em contacto.", "Build trust, explain the services and get people to get in touch.", "Inspirer confiance, expliquer les services et pousser à prendre contact.", "Transmitir confianza, explicar los servicios y llevar a las personas a contactar."),
      audience: L("Particulares e empresas que procuram um profissional competente e de confiança.", "Individuals and companies looking for a competent, trustworthy professional.", "Particuliers et entreprises à la recherche d'un professionnel compétent et fiable.", "Particulares y empresas que buscan un profesional competente y de confianza."),
      visual: L("Sóbria e moderna, com tipografia elegante, poucas cores e muito espaço em branco.", "Sober and modern, with elegant typography, a few colours and plenty of white space.", "Sobre et moderne, avec une typographie élégante, peu de couleurs et beaucoup d'espace blanc.", "Sobria y moderna, con tipografía elegante, pocos colores y mucho espacio en blanco."),
      headline: L("Experiência que se nota, clareza que se agradece.", "Experience you can feel, clarity you will appreciate.", "Une expérience qui se voit, une clarté appréciée.", "Experiencia que se nota, claridad que se agradece."),
      cta: L("Falar connosco", "Talk to us", "Nous contacter", "Hablar con nosotros"),
      sections: ["hero", "servicos", "sobre", "processo", "avaliacoes", "faq", "contactos"],
      features: ["formulario", "whatsapp", "seo", "perfil_google", "mapa"]
    },
    criativo: {
      type: L("Criativo e Portefólio", "Creative & Portfolio", "Créatif et portfolio", "Creativo y portafolio"),
      objective: L("Mostrar o trabalho com impacto e facilitar que novos clientes entrem em contacto.", "Show the work with impact and make it easy for new clients to get in touch.", "Présenter le travail avec impact et faciliter la prise de contact des nouveaux clients.", "Mostrar el trabajo con impacto y facilitar que nuevos clientes contacten."),
      audience: L("Pessoas e marcas que procuram um estilo próprio e querem ver trabalho real.", "People and brands looking for a distinctive style who want to see real work.", "Personnes et marques qui cherchent un style propre et veulent voir du vrai travail.", "Personas y marcas que buscan un estilo propio y quieren ver trabajo real."),
      visual: L("Editorial e arrojada, com imagens a toda a largura, tipografia forte e poucos elementos.", "Editorial and bold, with full-width images, strong typography and few elements.", "Éditoriale et audacieuse, avec des images pleine largeur, une typographie forte et peu d'éléments.", "Editorial y atrevida, con imágenes a todo ancho, tipografía fuerte y pocos elementos."),
      headline: L("O trabalho fala por si.", "The work speaks for itself.", "Le travail parle de lui-même.", "El trabajo habla por sí solo."),
      cta: L("Ver o portefólio", "See the portfolio", "Voir le portfolio", "Ver el portafolio"),
      sections: ["hero", "portfolio", "sobre", "servicos", "processo", "contactos"],
      features: ["portfolio_f", "formulario", "redes", "seo", "whatsapp"]
    },
    generico: {
      type: L("Presença online", "Online presence", "Présence en ligne", "Presencia online"),
      objective: L("Apresentar o negócio com clareza e facilitar o contacto com novos clientes.", "Present the business clearly and make it easy for new customers to get in touch.", "Présenter l'activité avec clarté et faciliter le contact des nouveaux clients.", "Presentar el negocio con claridad y facilitar el contacto de nuevos clientes."),
      audience: L("Clientes da zona e online que procuram informação rápida e de confiança.", "Local and online customers looking for quick, reliable information.", "Clients locaux et en ligne qui cherchent une information rapide et fiable.", "Clientes locales y online que buscan información rápida y fiable."),
      visual: L("Limpa e moderna, com a identidade do negócio em destaque, boas fotografias e leitura fácil no telemóvel.", "Clean and modern, with the business identity in the spotlight, good photos and easy reading on mobile.", "Épurée et moderne, avec l'identité de l'activité en avant, de belles photos et une lecture facile sur mobile.", "Limpia y moderna, con la identidad del negocio en primer plano, buenas fotografías y lectura fácil en el móvil."),
      headline: L("Conhece o que fazemos e fala connosco.", "See what we do and get in touch.", "Découvrez ce que nous faisons et contactez-nous.", "Descubre lo que hacemos y contáctanos."),
      cta: L("Falar connosco", "Talk to us", "Nous contacter", "Hablar con nosotros"),
      sections: ["hero", "sobre", "servicos", "galeria", "contactos"],
      features: ["formulario", "whatsapp", "mapa", "galeria_fotos", "seo"]
    }
  };

  var SUMMARY = L("Conceito para {tipo}{lugar}, a partir do que descreveste.", "Concept for {tipo}{lugar}, based on what you described.", "Concept pour {tipo}{lugar}, à partir de ce que vous avez décrit.", "Concepto para {tipo}{lugar}, a partir de lo que has descrito.");

  var SINAL_ROTULO = {
    galeria: L("galeria de fotografias", "photo gallery", "galerie photo", "galería de fotos"),
    formulario: L("formulário de contacto", "contact form", "formulaire de contact", "formulario de contacto"),
    reservas: L("pedidos de reserva ou marcação", "booking requests", "demandes de réservation", "solicitudes de reserva"),
    mapa: L("localização no mapa", "location map", "plan d'accès", "mapa de ubicación"),
    seccoes: L("várias secções", "several sections", "plusieurs sections", "varias secciones"),
    integracoes: L("ligação às redes sociais", "social media links", "liens vers les réseaux sociaux", "enlaces a redes sociales"),
    avaliacoes: L("espaço para avaliações", "space for reviews", "espace pour les avis", "espacio para valoraciones"),
    multilingue: L("versão noutro idioma", "version in another language", "version dans une autre langue", "versión en otro idioma"),
    blog: L("notícias ou artigos", "news or articles", "actualités ou articles", "noticias o artículos")
  };
  var RAZAO = {
    Essencial: L("Este plano é o mais indicado para o que descreveste: uma presença online simples, com a informação essencial e formas fáceis de contacto.", "This plan is the best fit for what you described: a simple online presence with the essential information and easy ways to get in touch.", "Cette offre est la plus adaptée à ce que vous avez décrit : une présence en ligne simple, avec l'essentiel et des moyens de contact faciles.", "Este plan es el más indicado para lo que has descrito: una presencia online sencilla, con la información esencial y formas fáciles de contactar."),
    "Negócio": L("Este plano é o mais indicado para o que descreveste: várias secções e uma apresentação mais completa{lista}.", "This plan is the best fit for what you described: several sections and a fuller presentation{lista}.", "Cette offre est la plus adaptée à ce que vous avez décrit : plusieurs sections et une présentation plus complète{lista}.", "Este plan es el más indicado para lo que has descrito: varias secciones y una presentación más completa{lista}."),
    "Loja Online": L("Este plano é o mais indicado para o que descreveste: queres vender online, com catálogo, carrinho e pagamentos.", "This plan is the best fit for what you described: you want to sell online, with a catalogue, cart and payments.", "Cette offre est la plus adaptée à ce que vous avez décrit : vous voulez vendre en ligne, avec catalogue, panier et paiements.", "Este plan es el más indicado para lo que has descrito: quieres vender online, con catálogo, carrito y pagos.")
  };

  // ---------- extração de factos (só do que o cliente escreveu) ----------
  var RE_NOME = /(?:chama-se|chamado|chamada|nome é|denominad[oa]|called|named|name is|s['’]appelle|appelé|appelée|se llama|llamado|llamada)\s+(?:["“”«]([^"“”»]{2,50})["“”»]|([A-ZÀ-Ý][\p{L}0-9&'’.-]*(?:\s+(?:(?:d[aeo]s?|of|de|du|del|la|le|&)\s+)?[A-ZÀ-Ý0-9][\p{L}0-9&'’.-]*){0,4}))/u;
  var RE_ASPAS = /["“«]([^"“”»]{3,40})["”»]/;
  var RE_LUGAR = /(?<![\p{L}])((?:em|no|na|nos|nas|perto d[eoa]s?|junto a[o]?|in|near|at|à|au|aux|en|près de|cerca de)\s+(?:(?:el|the|o|a|la|le)\s+)?(?:(?:centro|centre|center|zona|cidade|city|região|regiao|bairro|baixa|heart|coração|coracao|coeur|corazón|corazon)\s+(?:d[aeo]s?|of|de|du|del)\s+)?(?:[A-ZÀ-Ý][\p{L}'’-]+)(?:\s+(?:(?:d[aeo]s?|of|de|du|del|la|le)\s+)?[A-ZÀ-Ý][\p{L}'’-]+){0,2})/u;

  function extraiNome(texto) {
    try {
      var m = texto.match(RE_NOME);
      if (m) return (m[1] || m[2] || "").replace(/[.,;:!?]+$/, "").trim();
      var q = texto.match(RE_ASPAS);
      if (q) return q[1].trim();
    } catch (e) { /* regex unicode não suportada: ignora */ }
    return "";
  }
  function extraiLugar(texto) {
    try {
      var m = texto.match(RE_LUGAR);
      if (m) return m[1].replace(/[.,;:!?]+$/, "").trim();
    } catch (e) { /* ignora */ }
    return "";
  }

  // ---------- classificação ----------
  function categoria(t) {
    var melhor = "generico", pontos = 0;
    for (var i = 0; i < PRIORIDADE.length; i++) {
      var c = PRIORIDADE[i], p = countHits(t, KEYWORDS[c]);
      if (p > pontos) { pontos = p; melhor = c; }
    }
    return { nome: melhor, pontos: pontos };
  }
  function pareceNegocio(textoOriginal, t, cat) {
    var letras = (textoOriginal.match(/\p{L}/gu) || []).length;
    var palavras = textoOriginal.split(/\s+/).filter(function (w) { return /\p{L}{2,}/u.test(w); });
    var unicas = {}; palavras.forEach(function (w) { unicas[norm(w)] = 1; });
    if (letras < 35 || palavras.length < 6 || Object.keys(unicas).length < 5) return false;
    if (cat.pontos > 0) return true;
    return hasAny(t, INTENCAO);
  }

  function escolhePlano(t, sinais, texto) {
    if (sinais.ecommerce) return "Loja Online";
    if (sinais.simples) return "Essencial";
    var n = 0;
    ["galeria", "formulario", "reservas", "mapa", "seccoes", "integracoes", "avaliacoes", "multilingue", "blog"].forEach(function (k) { if (sinais[k]) n++; });
    if (texto.length >= 260) n++;
    return n >= 2 ? "Negócio" : "Essencial";
  }

  function junta(lista, lang) {
    if (lista.length <= 1) return lista.join("");
    var e = { pt: " e ", en: " and ", fr: " et ", es: " y " }[lang] || " and ";
    return lista.slice(0, -1).join(", ") + e + lista[lista.length - 1];
  }
  function dedup(arr) { var vistos = {}; return arr.filter(function (x) { if (vistos[x]) return false; vistos[x] = 1; return true; }); }

  function gerar(texto, lang) {
    lang = ["pt", "en", "fr", "es"].indexOf(lang) >= 0 ? lang : "pt";
    texto = String(texto || "").replace(/\s+/g, " ").trim();
    var t = norm(texto);
    var cat = categoria(t);
    if (!pareceNegocio(texto, t, cat)) return null;

    var sinais = {};
    Object.keys(SINAIS).forEach(function (k) { sinais[k] = hasAny(t, SINAIS[k]); });
    var plano = escolhePlano(t, sinais, texto);
    var online = plano === "Loja Online";
    var c = CAT[cat.nome];
    // loja física que só quer mostrar produtos não vira loja online
    var nome = extraiNome(texto), lugar = extraiLugar(texto);

    // secções: base da categoria + o que o cliente pediu
    var chaves = (online && c.sectionsOnline ? c.sectionsOnline : c.sections).slice();
    if (online && !c.sectionsOnline) chaves = ["hero", "catalogo", "destaques", "sobre", "faq", "contactos"];
    var antes = chaves.indexOf("contactos") >= 0 ? chaves.indexOf("contactos") : chaves.length;
    function insere(k) { if (chaves.indexOf(k) < 0) { chaves.splice(Math.min(antes, chaves.length), 0, k); antes++; } }
    if (sinais.galeria) insere("galeria");
    if (sinais.mapa) insere("localizacao");
    if (sinais.avaliacoes) insere("avaliacoes");
    if (sinais.reservas && cat.nome !== "alojamento" && cat.nome !== "restauracao" && cat.nome !== "beleza_saude" && cat.nome !== "ginasio") insere("marcacoes");
    if (chaves.indexOf("contactos") < 0) chaves.push("contactos");
    chaves = dedup(chaves).slice(0, 8);
    var seccoes = chaves.map(function (k) { return { title: pick(SEC[k][0], lang), description: pick(SEC[k][1], lang), kind: k }; });

    // funcionalidades
    var fns = (online && c.featuresOnline ? c.featuresOnline : c.features).slice();
    if (online && !c.featuresOnline) fns = ["catalogo", "carrinho", "pagamentos", "galeria_fotos", "whatsapp", "seo"];
    if (sinais.integracoes) fns.push("redes");
    if (sinais.reservas && fns.indexOf("reservas_form") < 0 && fns.indexOf("marcacoes_form") < 0) fns.push(cat.nome === "alojamento" ? "reservas_form" : "marcacoes_form");
    if (sinais.multilingue) fns.push("multilingue");
    if (sinais.avaliacoes) fns.push("avaliacoes_f");
    if (sinais.blog) fns.push("blog_f");
    if (sinais.formulario && fns.indexOf("formulario") < 0) fns.push("formulario");
    fns = dedup(fns).slice(0, 7);

    // plano e justificação
    var lista = "";
    if (plano === "Negócio") {
      var rot = [];
      ["galeria", "reservas", "formulario", "mapa", "integracoes", "avaliacoes", "multilingue", "blog"].forEach(function (k) { if (sinais[k] && rot.length < 3) rot.push(pick(SINAL_ROTULO[k], lang)); });
      if (rot.length) lista = " (" + junta(rot, lang) + ")";
    }
    var motivo = pick(RAZAO[plano], lang).replace("{lista}", lista);

    var tipo = pick(c.type, lang);
    var lugarTxt = lugar ? " " + lugar : "";
    var headline = lugar && c.headlineLugar ? pick(c.headlineLugar, lang).replace("{lugar}", lugar) : pick(c.headline, lang);

    return {
      businessName: nome || NOME_PADRAO,
      businessType: tipo,
      summary: pick(SUMMARY, lang).replace("{tipo}", tipo).replace("{lugar}", lugarTxt),
      objective: pick(c.objective, lang),
      targetAudience: pick(c.audience, lang),
      sections: seccoes,
      features: fns.map(function (k) { return pick(FN[k], lang); }),
      visualDirection: pick(c.visual, lang),
      headline: headline,
      cta: pick(c.cta, lang),
      recommendedPlan: plano,
      planReason: motivo,
      theme: cat.nome // só para o layout de exemplo
    };
  }

  root.BagatelaLocal = { gerar: gerar, NOME_PADRAO: NOME_PADRAO };
})(typeof globalThis !== "undefined" ? globalThis : this);
