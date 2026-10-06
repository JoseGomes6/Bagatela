#!/usr/bin/env python3
"""Gera as versões EN/FR/ES de index.html (fonte em PT), as páginas de privacidade e o sitemap.

Uso: python3 build.py
Para alterar um texto: edite index.html (PT) e, se for um texto novo, acrescente a linha
correspondente na tabela T abaixo. Depois volte a correr o script.
"""
import re, os

SITE = "https://www.bagatela.pt"
ROOT = os.path.dirname(os.path.abspath(__file__))
LANGS = ["en", "fr", "es"]
IDX = {"en": 1, "fr": 2, "es": 3}
HTML_LANG = {"pt": "pt-PT", "en": "en", "fr": "fr", "es": "es"}
OG_LOCALE = {"pt": "pt_PT", "en": "en_GB", "fr": "fr_FR", "es": "es_ES"}

# (pt, en, fr, es)
T = [
("Criação de Websites Low Cost em Portugal | Desde 179€ | Bagatela", "Low Cost Website Design in Portugal | From 179€ | Bagatela", "Création de sites web low cost au Portugal | Dès 179€ | Bagatela", "Creación de sitios web low cost en Portugal | Desde 179€ | Bagatela"),
("Criamos websites profissionais, rápidos e otimizados para o Google para pequenos negócios em Portugal. Sites desde 179€, design à medida e online em poucos dias.", "We build professional, fast, Google-optimised websites for small businesses in Portugal. Websites from 179€, custom design and online in just a few days.", "Nous créons des sites web professionnels, rapides et optimisés pour Google pour les petites entreprises au Portugal. Sites dès 179€, design sur mesure et en ligne en quelques jours.", "Creamos sitios web profesionales, rápidos y optimizados para Google para pequeños negocios en Portugal. Sitios desde 179€, diseño a medida y en línea en pocos días."),
("Sites à medida para pequenos negócios: rápidos, bonitos e prontos para o Google.", "Custom websites for small businesses: fast, beautiful and ready for Google.", "Des sites sur mesure pour les petites entreprises : rapides, beaux et prêts pour Google.", "Sitios web a medida para pequeños negocios: rápidos, bonitos y listos para Google."),
("Bagatela, websites profissionais a preço de bagatela", "Bagatela, professional websites at a bargain price", "Bagatela, des sites web professionnels à prix d'ami", "Bagatela, sitios web profesionales a precio de ganga"),
("Criação de websites profissionais e low cost para pequenos negócios em Portugal.", "Professional, low cost website design for small businesses in Portugal.", "Création de sites web professionnels et low cost pour les petites entreprises au Portugal.", "Creación de sitios web profesionales y low cost para pequeños negocios en Portugal."),
("Manutenção mensal", "Monthly maintenance", "Maintenance mensuelle", "Mantenimiento mensual"),
("Navegação principal", "Main navigation", "Navigation principale", "Navegación principal"),
("Bagatela, página inicial", "Bagatela, home page", "Bagatela, page d'accueil", "Bagatela, página de inicio"),
("Idioma", "Language", "Langue", "Idioma"),
("Serviços", "Services", "Services", "Servicios"),
("Exemplos", "Examples", "Exemples", "Ejemplos"),
("Preços", "Pricing", "Tarifs", "Precios"),
("Quem somos", "About us", "Qui sommes-nous", "Quiénes somos"),
("Perguntas", "FAQ", "FAQ", "Preguntas"),
("Vamos falar", "Let's talk", "Parlons-en", "Hablemos"),
("Desde 179€", "From 179€", "Dès 179€", "Desde 179€"),
("Sites online em poucos dias", "Websites online in just a few days", "Sites en ligne en quelques jours", "Sitios web en línea en pocos días"),
("Websites profissionais.", "Professional websites.", "Des sites web professionnels.", "Sitios web profesionales."),
("A preços de bagatela.", "At bargain prices.", "À prix d'ami.", "A precio de ganga."),
("Sites à medida para pequenos negócios: rápidos, bonitos no telemóvel e prontos para o Google. Sem jargão técnico, sem agência cara e sem surpresas na fatura.", "Custom websites for small businesses: fast, great on mobile and ready for Google. No tech jargon, no pricey agency and no surprises on the bill.", "Des sites sur mesure pour les petites entreprises : rapides, beaux sur mobile et prêts pour Google. Sans jargon technique, sans agence hors de prix et sans mauvaise surprise sur la facture.", "Sitios web a medida para pequeños negocios: rápidos, atractivos en el móvil y listos para Google. Sin jerga técnica, sin agencias caras y sin sorpresas en la factura."),
("Quero o meu site", "I want my website", "Je veux mon site", "Quiero mi sitio web"),
("Quanto custa esta bagatela?", "So, how much is it?", "Alors, ça coûte combien ?", "¿Cuánto cuesta esta bagatela?"),
("Sem mensalidades obrigatórias", "No mandatory monthly fees", "Sans abonnement obligatoire", "Sin cuotas mensuales obligatorias"),
("Domínio .pt incluído", ".pt domain included", "Domaine .pt inclus", "Dominio .pt incluido"),
("Velocidade", "Speed", "Vitesse", "Velocidad"),
("Fazemos sites para", "We build websites for", "Nous créons des sites pour", "Hacemos sitios web para"),
("Restauração", "Restaurants", "Restauration", "Restauración"),
("Beleza e estética", "Beauty & aesthetics", "Beauté et esthétique", "Belleza y estética"),
("Comércio local", "Local shops", "Commerce local", "Comercio local"),
("Serviços técnicos", "Trades & technical services", "Services techniques", "Servicios técnicos"),
("Alojamento local", "Holiday rentals", "Locations touristiques", "Alojamiento turístico"),
("Saúde e bem-estar", "Health & wellness", "Santé et bien-être", "Salud y bienestar"),
("Ginásios", "Gyms", "Salles de sport", "Gimnasios"),
("Oficinas", "Garages", "Garages", "Talleres"),
("Tudo o que um bom site precisa.", "Everything a good website needs.", "Tout ce dont un bon site a besoin.", "Todo lo que necesita un buen sitio web."),
("Tratamos da parte técnica do início ao fim. Fica com um site que trabalha por ti, mesmo quando a porta está fechada.", "We handle the technical side from start to finish. You get a website that works for you, even when the door is closed.", "Nous nous occupons de toute la partie technique, du début à la fin. Vous obtenez un site qui travaille pour vous, même quand la porte est fermée.", "Nos encargamos de la parte técnica de principio a fin. Tendrás un sitio web que trabaja por ti, incluso con la puerta cerrada."),
("Pensado para telemóvel", "Built for mobile", "Pensé pour le mobile", "Pensado para el móvil"),
("A maioria dos clientes procura no telemóvel. O teu site fica impecável em qualquer ecrã.", "Most customers search on their phone. Your site looks flawless on any screen.", "La plupart des clients cherchent sur leur téléphone. Votre site est impeccable sur tous les écrans.", "La mayoría de los clientes busca desde el móvil. Tu sitio se ve impecable en cualquier pantalla."),
("SEO para o Google", "SEO for Google", "SEO pour Google", "SEO para Google"),
("Estrutura, velocidade, títulos e descrições otimizados para pesquisas na tua zona.", "Structure, speed, titles and descriptions optimised for searches in your area.", "Structure, rapidité, titres et descriptions optimisés pour les recherches dans votre région.", "Estructura, velocidad, títulos y descripciones optimizados para búsquedas en tu zona."),
("Rapidez a sério", "Genuinely fast", "Une vraie rapidité", "Rapidez de verdad"),
("Páginas leves que abrem num instante, o que agrada aos clientes e ao Google.", "Lightweight pages that open instantly, which customers and Google both love.", "Des pages légères qui s'ouvrent instantanément, ce qui plaît aux clients et à Google.", "Páginas ligeras que abren al instante, lo que gusta a los clientes y a Google."),
("Domínio e segurança", "Domain and security", "Domaine et sécurité", "Dominio y seguridad"),
("Registamos o teu endereço .pt, configuramos o alojamento e o certificado SSL.", "We register your .pt address and set up hosting and the SSL certificate.", "Nous enregistrons votre adresse .pt et configurons l'hébergement et le certificat SSL.", "Registramos tu dirección .pt y configuramos el alojamiento y el certificado SSL."),
("Google Maps", "Google Maps", "Google Maps", "Google Maps"),
("Criamos ou melhoramos o teu Perfil de Empresa para aparecer no mapa.", "We create or improve your Business Profile so you show up on the map.", "Nous créons ou améliorons votre fiche d'établissement pour que vous apparaissiez sur la carte.", "Creamos o mejoramos tu Perfil de Empresa para que aparezcas en el mapa."),
("Contacto num toque", "Contact in one tap", "Contact en un clic", "Contacto con un toque"),
("Botões de chamada, WhatsApp e formulário para nunca perder um cliente.", "Call and WhatsApp buttons and a contact form so you never miss a customer.", "Boutons d'appel, WhatsApp et formulaire pour ne jamais perdre un client.", "Botones de llamada, WhatsApp y formulario para que nunca pierdas un cliente."),
("Um estilo para cada negócio.", "A style for every business.", "Un style pour chaque entreprise.", "Un estilo para cada negocio."),
("Nada de modelos iguais para todos. Abre os exemplos e vê como cada site é desenhado à volta do negócio. São projetos conceito, criados por nós para mostrar o que fazemos.", "No one-size-fits-all templates. Open the examples and see how each site is designed around the business. These are concept projects we made to show what we do.", "Pas de modèles identiques pour tous. Ouvrez les exemples et voyez comment chaque site est conçu autour de l'entreprise. Ce sont des projets conceptuels que nous avons créés pour montrer notre travail.", "Nada de plantillas iguales para todos. Abre los ejemplos y mira cómo se diseña cada sitio en torno al negocio. Son proyectos conceptuales que hemos creado para mostrar lo que hacemos."),
("Menu, reservas e horário à vista.", "Menu, bookings and opening hours at a glance.", "Menu, réservations et horaires en un coup d'œil.", "Carta, reservas y horario a la vista."),
("Serviços, preços e marcações online.", "Services, prices and online bookings.", "Services, tarifs et réservations en ligne.", "Servicios, precios y reservas online."),
("Zonas de serviço e contacto rápido.", "Service areas and quick contact.", "Zones d'intervention et contact rapide.", "Zonas de servicio y contacto rápido."),
("Ver exemplo", "View example (in Portuguese)", "Voir l'exemple (en portugais)", "Ver ejemplo (en portugués)"),
("Simples, do início ao fim.", "Simple, from start to finish.", "Simple, du début à la fin.", "Sencillo, de principio a fin."),
("Três passos e o teu negócio está online. Acompanhamos tudo pessoalmente.", "Three steps and your business is online. We look after everything personally.", "Trois étapes et votre entreprise est en ligne. Nous vous accompagnons personnellement.", "Tres pasos y tu negocio está en línea. Nos ocupamos de todo personalmente."),
("Conversamos", "We talk", "Nous échangeons", "Hablamos"),
("Conta-nos o que fazes e o que precisas. Uma chamada curta chega.", "Tell us what you do and what you need. A short call is enough.", "Dites-nous ce que vous faites et ce dont vous avez besoin. Un court appel suffit.", "Cuéntanos a qué te dedicas y qué necesitas. Con una llamada corta basta."),
("Desenhamos", "We design", "Nous concevons", "Diseñamos"),
("Preparamos a primeira versão e ajustamos até ficar como queres.", "We prepare the first version and tweak it until it's just how you want it.", "Nous préparons une première version et l'ajustons jusqu'à ce qu'elle vous plaise.", "Preparamos la primera versión y la ajustamos hasta que quede como quieres."),
("Publicamos", "We publish", "Nous publions", "Publicamos"),
("O site fica online no teu domínio, registado no Google.", "Your site goes live on your domain, registered with Google.", "Votre site est mis en ligne sur votre domaine, référencé sur Google.", "Tu sitio se publica en tu dominio, registrado en Google."),
("Preços claros, sem letras pequenas.", "Clear pricing, no small print.", "Des tarifs clairs, sans petites lignes.", "Precios claros, sin letra pequeña."),
("Pagamento único pelo site. Toca num plano para ver tudo o que está incluído.", "One-off payment for the website. Tap a plan to see everything that's included.", "Paiement unique pour le site. Touchez une offre pour voir tout ce qui est inclus.", "Pago único por el sitio web. Toca un plan para ver todo lo que incluye."),
("Essencial", "Essential", "Essentiel", "Esencial"),
("Para marcar presença online.", "To get your business online.", "Pour marquer votre présence en ligne.", "Para tener presencia en internet."),
("pagamento único", "one-off payment", "paiement unique", "pago único"),
("Site de uma página, ideal para começar.", "One-page website, ideal to get started.", "Site d'une page, idéal pour démarrer.", "Sitio de una página, ideal para empezar."),
("Ver o que está incluído", "See what's included", "Voir ce qui est inclus", "Ver qué incluye"),
("Esconder detalhes", "Hide details", "Masquer les détails", "Ocultar detalles"),
("Site de 1 página com até 5 secções", "One-page site with up to 5 sections", "Site d'une page avec jusqu'à 5 sections", "Sitio de 1 página con hasta 5 secciones"),
("Design adaptado a telemóvel e tablet", "Design adapted to mobile and tablet", "Design adapté au mobile et à la tablette", "Diseño adaptado a móvil y tableta"),
("Botões de chamada, WhatsApp e e-mail", "Call, WhatsApp and email buttons", "Boutons d'appel, WhatsApp et e-mail", "Botones de llamada, WhatsApp y correo"),
("Mapa do Google Maps integrado", "Integrated Google Maps map", "Carte Google Maps intégrée", "Mapa de Google Maps integrado"),
("Ligação às redes sociais", "Social media links", "Liens vers les réseaux sociaux", "Enlaces a redes sociales"),
("SEO base: títulos, descrições e velocidade", "Basic SEO: titles, descriptions and speed", "SEO de base : titres, descriptions et rapidité", "SEO básico: títulos, descripciones y velocidad"),
("Registo no Google Search Console", "Google Search Console registration", "Enregistrement dans Google Search Console", "Registro en Google Search Console"),
("Certificado de segurança SSL", "SSL security certificate", "Certificat de sécurité SSL", "Certificado de seguridad SSL"),
("Domínio .pt e alojamento no 1.º ano", ".pt domain and hosting for the 1st year", "Domaine .pt et hébergement la 1re année", "Dominio .pt y alojamiento el primer año"),
("1 ronda de alterações", "1 round of changes", "1 série de modifications", "1 ronda de cambios"),
("Entrega:", "Delivery:", "Livraison :", "Entrega:"),
("até 5 dias úteis", "up to 5 working days", "jusqu'à 5 jours ouvrés", "hasta 5 días laborables"),
("Quero o Essencial", "Get Essential", "Je veux l'Essentiel", "Quiero el Esencial"),
("Recomendado", "Recommended", "Recommandé", "Recomendado"),
("Negócio", "Business", "Business", "Negocio"),
("Melhor relação qualidade/preço.", "Best value for money.", "Le meilleur rapport qualité-prix.", "La mejor relación calidad-precio."),
("Até 5 páginas, com SEO local completo.", "Up to 5 pages, with full local SEO.", "Jusqu'à 5 pages, avec SEO local complet.", "Hasta 5 páginas, con SEO local completo."),
("Tudo o que está no plano Essencial", "Everything in the Essential plan", "Tout ce qui est dans l'offre Essentiel", "Todo lo del plan Esencial"),
("Até 5 páginas (ex.: Início, Serviços, Galeria, Sobre, Contactos)", "Up to 5 pages (e.g. Home, Services, Gallery, About, Contact)", "Jusqu'à 5 pages (ex. : Accueil, Services, Galerie, À propos, Contact)", "Hasta 5 páginas (p. ej.: Inicio, Servicios, Galería, Sobre nosotros, Contacto)"),
("Galeria de fotografias", "Photo gallery", "Galerie photo", "Galería de fotografías"),
("Página de serviços com preços", "Services page with prices", "Page de services avec tarifs", "Página de servicios con precios"),
("Formulário de contacto", "Contact form", "Formulaire de contact", "Formulario de contacto"),
("SEO local completo para a tua zona", "Full local SEO for your area", "SEO local complet pour votre zone", "SEO local completo para tu zona"),
("Criação do Perfil de Empresa no Google", "Google Business Profile setup", "Création de la fiche Google Business", "Creación del Perfil de Empresa en Google"),
("Estatísticas de visitas (Google Analytics)", "Visit statistics (Google Analytics)", "Statistiques de visites (Google Analytics)", "Estadísticas de visitas (Google Analytics)"),
("Política de privacidade e aviso de cookies (RGPD)", "Privacy policy and cookie notice (GDPR)", "Politique de confidentialité et avis cookies (RGPD)", "Política de privacidad y aviso de cookies (RGPD)"),
("2 rondas de alterações", "2 rounds of changes", "2 séries de modifications", "2 rondas de cambios"),
("até 10 dias úteis", "up to 10 working days", "jusqu'à 10 jours ouvrés", "hasta 10 días laborables"),
("Quero o Negócio", "Get Business", "Je veux Business", "Quiero el Negocio"),
("Loja Online", "Online Store", "Boutique en ligne", "Tienda online"),
("Para vender 24 horas por dia.", "To sell 24 hours a day.", "Pour vendre 24 h sur 24.", "Para vender las 24 horas del día."),
("Loja completa com pagamentos portugueses.", "Complete store with Portuguese payment methods.", "Boutique complète avec les moyens de paiement portugais.", "Tienda completa con métodos de pago portugueses."),
("Tudo o que está no plano Negócio", "Everything in the Business plan", "Tout ce qui est dans l'offre Business", "Todo lo del plan Negocio"),
("Loja online com até 50 produtos", "Online store with up to 50 products", "Boutique en ligne jusqu'à 50 produits", "Tienda online con hasta 50 productos"),
("Carrinho de compras e checkout", "Shopping cart and checkout", "Panier et paiement", "Carrito de compra y pago"),
("Pagamentos por MB WAY, Multibanco e cartão", "MB WAY, Multibanco and card payments", "Paiements par MB WAY, Multibanco et carte", "Pagos con MB WAY, Multibanco y tarjeta"),
("Gestão de stock e portes de envio", "Stock management and shipping costs", "Gestion des stocks et frais de port", "Gestión de stock y gastos de envío"),
("E-mails automáticos de confirmação de encomenda", "Automatic order confirmation emails", "E-mails automatiques de confirmation de commande", "Correos automáticos de confirmación de pedido"),
("Página de termos e condições e devoluções", "Terms and conditions and returns page", "Page conditions générales et retours", "Página de términos y condiciones y devoluciones"),
("1 hora de formação para gerir a loja", "1 hour of training to manage the store", "1 heure de formation pour gérer la boutique", "1 hora de formación para gestionar la tienda"),
("3 rondas de alterações", "3 rounds of changes", "3 séries de modifications", "3 rondas de cambios"),
("até 15 dias úteis", "up to 15 working days", "jusqu'à 15 jours ouvrés", "hasta 15 días laborables"),
("Quero a Loja Online", "Get Online Store", "Je veux la Boutique en ligne", "Quiero la Tienda online"),
("Domínio e alojamento incluídos no 1.º ano em todos os planos.", "Domain and hosting included in the 1st year on all plans.", "Domaine et hébergement inclus la 1re année dans toutes les offres.", "Dominio y alojamiento incluidos el primer año en todos los planes."),
("Opcional", "Optional", "Optionnel", "Opcional"),
("/mês", "/month", "/mois", "/mes"),
("Para quem quer o site sempre atualizado sem se preocupar com nada. Sem fidelização, cancelas quando quiseres.", "For those who want an always up-to-date site without worrying about anything. No lock-in, cancel whenever you like.", "Pour ceux qui veulent un site toujours à jour sans se soucier de rien. Sans engagement, résiliable à tout moment.", "Para quien quiere el sitio siempre actualizado sin preocuparse de nada. Sin permanencia, cancela cuando quieras."),
("Até 1 hora de alterações por mês (textos, fotos, preços)", "Up to 1 hour of changes per month (texts, photos, prices)", "Jusqu'à 1 heure de modifications par mois (textes, photos, prix)", "Hasta 1 hora de cambios al mes (textos, fotos, precios)"),
("Atualizações de segurança", "Security updates", "Mises à jour de sécurité", "Actualizaciones de seguridad"),
("Cópias de segurança semanais", "Weekly backups", "Sauvegardes hebdomadaires", "Copias de seguridad semanales"),
("Monitorização do site 24 horas", "24-hour site monitoring", "Surveillance du site 24 h/24", "Monitorización del sitio 24 horas"),
("Relatório mensal de visitas e posição no Google", "Monthly report on visits and Google ranking", "Rapport mensuel des visites et du classement Google", "Informe mensual de visitas y posición en Google"),
("Suporte prioritário por WhatsApp", "Priority support via WhatsApp", "Support prioritaire par WhatsApp", "Soporte prioritario por WhatsApp"),
("Extras e renovações", "Extras and renewals", "Options et renouvellements", "Extras y renovaciones"),
("Acrescenta só o que precisas, quando precisares.", "Add only what you need, when you need it.", "Ajoutez seulement ce dont vous avez besoin, quand vous en avez besoin.", "Añade solo lo que necesites, cuando lo necesites."),
("Serviço", "Service", "Service", "Servicio"),
("Preço", "Price", "Prix", "Precio"),
("Domínio .pt e alojamento (a partir do 2.º ano)", ".pt domain and hosting (from year 2)", "Domaine .pt et hébergement (à partir de la 2e année)", "Dominio .pt y alojamiento (a partir del 2.º año)"),
("89€/ano", "89€/year", "89€/an", "89€/año"),
("E-mail profissional (ex.: geral@oseunegocio.pt)", "Professional email (e.g. info@yourbusiness.pt)", "E-mail professionnel (ex. : contact@votreentreprise.pt)", "Correo profesional (p. ej.: info@tunegocio.pt)"),
("24€/ano por conta", "24€/year per account", "24€/an par compte", "24€/año por cuenta"),
("Página adicional", "Extra page", "Page supplémentaire", "Página adicional"),
("Redação de textos", "Copywriting", "Rédaction de textes", "Redacción de textos"),
("25€/página", "25€/page", "25€/page", "25€/página"),
("Logótipo simples", "Simple logo", "Logo simple", "Logotipo sencillo"),
("Versão em inglês", "Version in another language", "Version dans une autre langue", "Versión en otro idioma"),
("30€/página", "30€/page", "30€/page", "30€/página"),
("Pack de 50 produtos extra na loja", "Pack of 50 extra products for the store", "Pack de 50 produits supplémentaires pour la boutique", "Pack de 50 productos extra en la tienda"),
("Alterações avulsas (sem manutenção)", "One-off changes (without maintenance)", "Modifications ponctuelles (hors maintenance)", "Cambios puntuales (sin mantenimiento)"),
("25€/hora", "25€/hour", "25€/heure", "25€/hora"),
("Perguntas frequentes", "Frequently asked questions", "Questions fréquentes", "Preguntas frecuentes"),
("Não encontras a resposta?", "Can't find the answer?", "Vous ne trouvez pas la réponse ?", "¿No encuentras la respuesta?"),
("Fala connosco", "Talk to us", "Parlez-nous", "Habla con nosotros"),
(", respondemos rapidamente.", ", we reply quickly.", ", nous répondons rapidement.", ", respondemos enseguida."),
("Quanto tempo demora a ter o site pronto?", "How long does it take to get the site ready?", "Combien de temps faut-il pour que le site soit prêt ?", "¿Cuánto tarda en estar listo el sitio?"),
("Na maioria dos casos o site fica online poucos dias depois de recebermos os textos e as fotografias.", "In most cases the site goes live a few days after we receive your texts and photos.", "Dans la plupart des cas, le site est en ligne quelques jours après réception de vos textes et photos.", "En la mayoría de los casos el sitio está en línea pocos días después de recibir los textos y las fotografías."),
("O domínio e o alojamento estão incluídos?", "Are the domain and hosting included?", "Le domaine et l'hébergement sont-ils inclus ?", "¿Están incluidos el dominio y el alojamiento?"),
("Tratamos do registo do domínio .pt e do alojamento. Os custos anuais aparecem de forma clara na proposta.", "We take care of registering the .pt domain and the hosting. Annual costs are shown clearly in the proposal.", "Nous nous occupons de l'enregistrement du domaine .pt et de l'hébergement. Les coûts annuels figurent clairement dans la proposition.", "Nos encargamos del registro del dominio .pt y del alojamiento. Los costes anuales aparecen claramente en la propuesta."),
("Posso pedir alterações depois?", "Can I request changes later?", "Puis-je demander des modifications plus tard ?", "¿Puedo pedir cambios más adelante?"),
("Sim. Podes pedir alterações avulsas a 25€/hora ou aderir à manutenção mensal opcional de 50€/mês, que inclui até 1 hora de alterações por mês.", "Yes. You can request one-off changes at 25€/hour or sign up for the optional monthly maintenance at 50€/month, which includes up to 1 hour of changes per month.", "Oui. Vous pouvez demander des modifications ponctuelles à 25€/heure ou souscrire la maintenance mensuelle optionnelle à 50€/mois, qui inclut jusqu'à 1 heure de modifications par mois.", "Sí. Puedes pedir cambios puntuales a 25€/hora o contratar el mantenimiento mensual opcional de 50€/mes, que incluye hasta 1 hora de cambios al mes."),
("O meu site vai aparecer no Google?", "Will my site show up on Google?", "Mon site apparaîtra-t-il sur Google ?", "¿Mi sitio aparecerá en Google?"),
("Todos os sites seguem boas práticas de SEO: carregamento rápido, versão para telemóvel, títulos e descrições otimizados e registo no Google Search Console.", "All sites follow SEO best practice: fast loading, mobile version, optimised titles and descriptions and Google Search Console registration.", "Tous les sites suivent les bonnes pratiques SEO : chargement rapide, version mobile, titres et descriptions optimisés et enregistrement dans Google Search Console.", "Todos los sitios siguen buenas prácticas de SEO: carga rápida, versión móvil, títulos y descripciones optimizados y registro en Google Search Console."),
("Não tenho textos nem fotografias. E agora?", "I don't have texts or photos. Now what?", "Je n'ai ni textes ni photos. Et maintenant ?", "No tengo textos ni fotografías. ¿Y ahora?"),
("Ajudamos a escrever os textos e indicamos como tirar boas fotografias com o telemóvel. Também podemos usar imagens de bancos gratuitos.", "We help write the texts and show you how to take good photos with your phone. We can also use free stock images.", "Nous vous aidons à rédiger les textes et vous expliquons comment prendre de bonnes photos avec votre téléphone. Nous pouvons aussi utiliser des banques d'images gratuites.", "Te ayudamos a escribir los textos y te indicamos cómo hacer buenas fotos con el móvil. También podemos usar imágenes de bancos gratuitos."),
("Vamos pôr o teu negócio online.", "Let's put your business online.", "Mettons votre entreprise en ligne.", "Vamos a poner tu negocio en línea."),
("Conta-nos o que precisas e entramos em contacto contigo. Sem compromisso.", "Tell us what you need and we'll get in touch with you. No commitment.", "Dites-nous ce dont vous avez besoin et nous vous contactons. Sans engagement.", "Cuéntanos lo que necesitas y nos pondremos en contacto contigo. Sin compromiso."),
("Preencher formulário", "Fill in the form", "Remplir le formulaire", "Rellenar el formulario"),
("Falar no WhatsApp", "Chat on WhatsApp", "Écrire sur WhatsApp", "Hablar por WhatsApp"),
("Ligar agora", "Call now", "Appeler maintenant", "Llamar ahora"),
("Fechar", "Close", "Fermer", "Cerrar"),
("Conta-nos o que precisas", "Tell us what you need", "Dites-nous ce dont vous avez besoin", "Cuéntanos lo que necesitas"),
("Preenche e entramos em contacto contigo.", "Fill it in and we'll get in touch.", "Remplissez le formulaire et nous vous contactons.", "Rellénalo y nos ponemos en contacto contigo."),
("Nome", "Name", "Nom", "Nombre"),
("Empresa", "Company", "Entreprise", "Empresa"),
("E-mail ou telefone", "Email or phone", "E-mail ou téléphone", "Correo o teléfono"),
("Tipo de serviço", "Type of service", "Type de service", "Tipo de servicio"),
("Escolhe uma opção", "Choose an option", "Choisissez une option", "Elige una opción"),
("Essencial (179€)", "Essential (179€)", "Essentiel (179€)", "Esencial (179€)"),
("Negócio (299€)", "Business (299€)", "Business (299€)", "Negocio (299€)"),
("Loja Online (599€)", "Online Store (599€)", "Boutique en ligne (599€)", "Tienda online (599€)"),
("Manutenção mensal (50€/mês)", "Monthly maintenance (50€/month)", "Maintenance mensuelle (50€/mois)", "Mantenimiento mensual (50€/mes)"),
("Outro / Não sei ainda", "Other / Not sure yet", "Autre / Je ne sais pas encore", "Otro / Aún no lo sé"),
("Mensagem", "Message", "Message", "Mensaje"),
("O que gostavas de fazer?", "What would you like to do?", "Que souhaitez-vous faire ?", "¿Qué te gustaría hacer?"),
("Ao enviar aceitas a nossa", "By sending, you accept our", "En envoyant, vous acceptez notre", "Al enviar aceptas nuestra"),
("política de privacidade", "privacy policy", "politique de confidentialité", "política de privacidad"),
("Enviar mensagem", "Send message", "Envoyer le message", "Enviar mensaje"),
("Assistente", "Assistant", "Assistant", "Asistente"),
("Abrir assistente", "Open assistant", "Ouvrir l'assistant", "Abrir asistente"),
("Assistente Bagatela", "Bagatela assistant", "Assistant Bagatela", "Asistente de Bagatela"),
("Escolhe uma pergunta", "Choose a question", "Choisissez une question", "Elige una pregunta"),
("Olá! Sou o assistente da Bagatela. Em que posso ajudar?", "Hi! I'm the Bagatela assistant. How can I help?", "Bonjour ! Je suis l'assistant de Bagatela. Comment puis-je vous aider ?", "¡Hola! Soy el asistente de Bagatela. ¿En qué puedo ayudarte?"),
("Preferes falar com uma pessoa?", "Prefer to talk to a person?", "Vous préférez parler à une personne ?", "¿Prefieres hablar con una persona?"),
("Quanto custa?", "How much does it cost?", "Combien ça coûte ?", "¿Cuánto cuesta?"),
("Temos 3 planos de pagamento único: Essencial 179€, Negócio 299€ e Loja Online 599€. A manutenção mensal é opcional, 50€/mês.", "We have 3 one-off payment plans: Essential 179€, Business 299€ and Online Store 599€. Monthly maintenance is optional, at 50€/month.", "Nous avons 3 offres à paiement unique : Essentiel 179€, Business 299€ et Boutique en ligne 599€. La maintenance mensuelle est optionnelle, à 50€/mois.", "Tenemos 3 planes de pago único: Esencial 179€, Negocio 299€ y Tienda online 599€. El mantenimiento mensual es opcional, 50€/mes."),
("O que inclui cada plano?", "What does each plan include?", "Que comprend chaque offre ?", "¿Qué incluye cada plan?"),
("Essencial: site de 1 página com até 5 secções. Negócio: até 5 páginas com SEO local completo. Loja Online: loja com até 50 produtos e pagamentos por MB WAY, Multibanco e cartão. Na secção de preços podes ver tudo em detalhe.", "Essential: one-page site with up to 5 sections. Business: up to 5 pages with full local SEO. Online Store: store with up to 50 products and MB WAY, Multibanco and card payments. You can see everything in detail in the pricing section.", "Essentiel : site d'une page avec jusqu'à 5 sections. Business : jusqu'à 5 pages avec SEO local complet. Boutique en ligne : boutique jusqu'à 50 produits avec paiements MB WAY, Multibanco et carte. Vous pouvez tout voir en détail dans la section des tarifs.", "Esencial: sitio de 1 página con hasta 5 secciones. Negocio: hasta 5 páginas con SEO local completo. Tienda online: tienda con hasta 50 productos y pagos con MB WAY, Multibanco y tarjeta. En la sección de precios puedes verlo todo en detalle."),
("Quanto tempo demora?", "How long does it take?", "Combien de temps cela prend-il ?", "¿Cuánto tarda?"),
("Essencial até 5 dias úteis, Negócio até 10 e Loja Online até 15, a contar da receção dos textos e fotografias.", "Essential takes up to 5 working days, Business up to 10 and Online Store up to 15, counted from when we receive your texts and photos.", "Essentiel : jusqu'à 5 jours ouvrés, Business : jusqu'à 10 et Boutique en ligne : jusqu'à 15, à compter de la réception de vos textes et photos.", "Esencial: hasta 5 días laborables, Negocio hasta 10 y Tienda online hasta 15, a contar desde que recibimos los textos y las fotografías."),
("O domínio está incluído?", "Is the domain included?", "Le domaine est-il inclus ?", "¿Está incluido el dominio?"),
("Sim, o domínio .pt e o alojamento estão incluídos no 1.º ano. A partir do 2.º ano são 89€/ano.", "Yes, the .pt domain and hosting are included in the 1st year. From year 2 it's 89€/year.", "Oui, le domaine .pt et l'hébergement sont inclus la 1re année. À partir de la 2e année, c'est 89€/an.", "Sí, el dominio .pt y el alojamiento están incluidos el primer año. A partir del 2.º año son 89€/año."),
("Sim. Alterações avulsas custam 25€/hora, ou podes aderir à manutenção mensal de 50€/mês, que inclui até 1 hora de alterações por mês.", "Yes. One-off changes cost 25€/hour, or you can sign up for monthly maintenance at 50€/month, which includes up to 1 hour of changes per month.", "Oui. Les modifications ponctuelles coûtent 25€/heure, ou vous pouvez souscrire la maintenance mensuelle à 50€/mois, qui inclut jusqu'à 1 heure de modifications par mois.", "Sí. Los cambios puntuales cuestan 25€/hora, o puedes contratar el mantenimiento mensual de 50€/mes, que incluye hasta 1 hora de cambios al mes."),
("Sem problema: ajudamos a escrever os textos (25€/página) e indicamos como tirar boas fotografias com o telemóvel.", "No problem: we help write the texts (25€/page) and show you how to take good photos with your phone.", "Pas de souci : nous vous aidons à rédiger les textes (25€/page) et vous expliquons comment prendre de bonnes photos avec votre téléphone.", "Sin problema: te ayudamos a escribir los textos (25€/página) y te indicamos cómo hacer buenas fotos con el móvil."),
("Como começo?", "How do I get started?", "Comment commencer ?", "¿Cómo empiezo?"),
("Preenche o formulário ou fala connosco por WhatsApp. Conta-nos o que precisas e entramos em contacto contigo.", "Fill in the form or chat with us on WhatsApp. Tell us what you need and we'll get in touch with you.", "Remplissez le formulaire ou écrivez-nous sur WhatsApp. Dites-nous ce dont vous avez besoin et nous vous contactons.", "Rellena el formulario o escríbenos por WhatsApp. Cuéntanos lo que necesitas y nos pondremos en contacto contigo."),
("Como vos contacto?", "How do I contact you?", "Comment vous contacter ?", "¿Cómo contacto con vosotros?"),
("Podes ligar para 917 385 546 ou 932 904 463, escrever para geral@bagatela.pt ou usar o formulário.", "You can call +351 917 385 546 or +351 932 904 463, write to geral@bagatela.pt or use the form.", "Vous pouvez appeler le +351 917 385 546 ou le +351 932 904 463, écrire à geral@bagatela.pt ou utiliser le formulaire.", "Puedes llamar al +351 917 385 546 o al +351 932 904 463, escribir a geral@bagatela.pt o usar el formulario."),
("Rodapé", "Footer", "Pied de page", "Pie de página"),
("Privacidade", "Privacy", "Confidentialité", "Privacidad"),
("Livro de Reclamações", "Complaints Book (Portugal)", "Livre de réclamations (Portugal)", "Libro de Reclamaciones (Portugal)"),
("© 2026 Bagatela. Criação de websites em Portugal.", "© 2026 Bagatela. Website design in Portugal.", "© 2026 Bagatela. Création de sites web au Portugal.", "© 2026 Bagatela. Creación de sitios web en Portugal."),
("Vamos fazer negócio", "Let's do business", "Faisons affaire", "Hagamos negocio"),
("Antes de perguntar…", "Before you ask…", "Avant de demander…", "Antes de preguntar…"),
("Conceito", "Concept", "Concept", "Concepto"),
("Para começar", "To start", "Pour démarrer", "Para empezar"),
("E-commerce", "E-commerce", "E-commerce", "E-commerce"),
("Preço fechado", "Fixed price", "Prix fixe", "Precio cerrado"),
("Abrir menu", "Open menu", "Ouvrir le menu", "Abrir menú"),
("Quem está por trás da Bagatela?", "Who's behind Bagatela?", "Qui se cache derrière Bagatela ?", "¿Quién está detrás de Bagatela?"),
("Somos uma equipa pequena, o que significa que cada projeto recebe atenção pessoal. Falas diretamente com quem faz o teu site, sem intermediários nem jargão técnico.", "We're a small team, which means every project gets personal attention. You talk directly to whoever builds your site, with no middlemen and no jargon.", "Nous sommes une petite équipe, ce qui signifie que chaque projet reçoit une attention personnelle. Vous parlez directement à la personne qui crée votre site, sans intermédiaires ni jargon.", "Somos un equipo pequeño, lo que significa que cada proyecto recibe atención personal. Hablas directamente con quien hace tu sitio, sin intermediarios ni jerga."),
("Equipa pequena", "Small team", "Petite équipe", "Equipo pequeño"),
("Contacto direto", "Direct contact", "Contact direct", "Contacto directo"),
("Menos burocracia", "Less red tape", "Moins de paperasse", "Menos burocracia"),
("Preços mais acessíveis", "More affordable prices", "Des prix plus accessibles", "Precios más accesibles"),
("Porque ter um bom site não devia ser um luxo.", "Because a good website shouldn't be a luxury.", "Parce qu'un bon site ne devrait pas être un luxe.", "Porque tener un buen sitio web no debería ser un lujo."),
]

# mensagens do JavaScript do formulário (pt -> en, fr, es)
JS = [
("Preenche os campos obrigatórios.", "Please fill in the required fields.", "Veuillez remplir les champs obligatoires.", "Rellena los campos obligatorios."),
("A enviar...", "Sending...", "Envoi en cours...", "Enviando..."),
("Mensagem enviada. Entramos em contacto contigo em breve!", "Message sent. We'll be in touch soon!", "Message envoyé. Nous vous contacterons très bientôt !", "Mensaje enviado. ¡Nos pondremos en contacto contigo muy pronto!"),
("Não foi possível enviar. Escreve-nos para", "Couldn't send. Write to us at", "Envoi impossible. Écrivez-nous à", "No se pudo enviar. Escríbenos a"),
("ou liga 917 385 546.", "or call +351 917 385 546.", "ou appelez le +351 917 385 546.", "o llama al +351 917 385 546."),
]

PRIV = {
"pt": dict(title="Política de Privacidade", upd="Última atualização: outubro de 2026", back="← Bagatela", secs=[
 ("Quem somos","A Bagatela cria websites para pequenos negócios em Portugal. Para qualquer questão sobre dados pessoais, contacta-nos em <a href=\"mailto:geral@bagatela.pt\">geral@bagatela.pt</a>."),
 ("Que dados recolhemos","Apenas os dados que nos envias através do formulário de contacto: nome, empresa, e-mail ou telefone, tipo de serviço pretendido e a mensagem. Se nos contactares por WhatsApp, telefone ou e-mail, ficamos também com os dados dessa conversa."),
 ("Para que usamos os dados","Exclusivamente para responder ao teu pedido e, se avançarmos juntos, preparar e acompanhar o teu projeto. Não enviamos publicidade nem partilhamos os teus dados para fins de marketing."),
 ("Fundamento legal","O tratamento baseia-se no teu pedido de contacto e na execução de diligências pré-contratuais, nos termos do Regulamento Geral sobre a Proteção de Dados (RGPD)."),
 ("Com quem partilhamos","O formulário é processado pelo serviço FormSubmit, que apenas encaminha a mensagem para o nosso e-mail. Não vendemos nem cedemos os teus dados a terceiros."),
 ("Quanto tempo guardamos","Pelo tempo necessário para responder ao teu pedido e, se for cliente, durante o período exigido por lei. Podes pedir a eliminação a qualquer momento."),
 ("Os teus direitos","Podes pedir acesso, retificação, eliminação ou limitação dos teus dados, e opor-se ao tratamento, escrevendo para <a href=\"mailto:geral@bagatela.pt\">geral@bagatela.pt</a>. Tens também o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (<a href=\"https://www.cnpd.pt\">cnpd.pt</a>)."),
 ("Cookies","Este site não usa cookies de publicidade nem de seguimento. Os tipos de letra são carregados a partir do Google Fonts."),
 ("Livro de Reclamações","Podes apresentar uma reclamação em <a href=\"https://www.livroreclamacoes.pt\">livroreclamacoes.pt</a>."),
]),
"en": dict(title="Privacy Policy", upd="Last updated: October 2026", back="← Bagatela", secs=[
 ("Who we are","Bagatela builds websites for small businesses in Portugal. For any question about personal data, contact us at <a href=\"mailto:geral@bagatela.pt\">geral@bagatela.pt</a>."),
 ("What data we collect","Only the data you send us through the contact form: name, company, email or phone, the type of service you want and your message. If you contact us by WhatsApp, phone or email, we also keep the details of that conversation."),
 ("What we use it for","Solely to reply to your request and, if we go ahead together, to prepare and follow your project. We don't send advertising or share your data for marketing purposes."),
 ("Legal basis","Processing is based on your request to be contacted and on pre-contractual steps, under the General Data Protection Regulation (GDPR)."),
 ("Who we share it with","The form is processed by the FormSubmit service, which only forwards the message to our email. We don't sell or hand your data to third parties."),
 ("How long we keep it","For as long as needed to answer your request and, if you become a customer, for the period required by law. You can ask for deletion at any time."),
 ("Your rights","You can request access, rectification, erasure or restriction of your data, and object to processing, by writing to <a href=\"mailto:geral@bagatela.pt\">geral@bagatela.pt</a>. You also have the right to lodge a complaint with the Portuguese data protection authority (CNPD, <a href=\"https://www.cnpd.pt\">cnpd.pt</a>)."),
 ("Cookies","This site does not use advertising or tracking cookies. Fonts are loaded from Google Fonts."),
 ("Complaints Book","You can file a complaint at <a href=\"https://www.livroreclamacoes.pt\">livroreclamacoes.pt</a> (Portugal)."),
]),
"fr": dict(title="Politique de confidentialité", upd="Dernière mise à jour : octobre 2026", back="← Bagatela", secs=[
 ("Qui sommes-nous","Bagatela crée des sites web pour les petites entreprises au Portugal. Pour toute question sur les données personnelles, contactez-nous à <a href=\"mailto:geral@bagatela.pt\">geral@bagatela.pt</a>."),
 ("Quelles données collectons-nous","Uniquement les données que vous nous envoyez via le formulaire de contact : nom, entreprise, e-mail ou téléphone, type de service souhaité et message. Si vous nous contactez par WhatsApp, téléphone ou e-mail, nous conservons aussi les données de cet échange."),
 ("Pourquoi les utilisons-nous","Exclusivement pour répondre à votre demande et, si nous travaillons ensemble, préparer et suivre votre projet. Nous n'envoyons pas de publicité et ne partageons pas vos données à des fins de marketing."),
 ("Base juridique","Le traitement repose sur votre demande de contact et sur des mesures précontractuelles, conformément au Règlement général sur la protection des données (RGPD)."),
 ("Avec qui les partageons-nous","Le formulaire est traité par le service FormSubmit, qui se contente de transmettre le message à notre e-mail. Nous ne vendons ni ne cédons vos données à des tiers."),
 ("Combien de temps les conservons-nous","Le temps nécessaire pour répondre à votre demande et, si vous devenez client, pendant la durée exigée par la loi. Vous pouvez demander la suppression à tout moment."),
 ("Vos droits","Vous pouvez demander l'accès, la rectification, l'effacement ou la limitation de vos données, et vous opposer au traitement, en écrivant à <a href=\"mailto:geral@bagatela.pt\">geral@bagatela.pt</a>. Vous pouvez aussi déposer une réclamation auprès de l'autorité portugaise de protection des données (CNPD, <a href=\"https://www.cnpd.pt\">cnpd.pt</a>)."),
 ("Cookies","Ce site n'utilise pas de cookies publicitaires ni de suivi. Les polices sont chargées depuis Google Fonts."),
 ("Livre de réclamations","Vous pouvez déposer une réclamation sur <a href=\"https://www.livroreclamacoes.pt\">livroreclamacoes.pt</a> (Portugal)."),
]),
"es": dict(title="Política de privacidad", upd="Última actualización: octubre de 2026", back="← Bagatela", secs=[
 ("Quiénes somos","Bagatela crea sitios web para pequeños negocios en Portugal. Para cualquier duda sobre datos personales, escríbenos a <a href=\"mailto:geral@bagatela.pt\">geral@bagatela.pt</a>."),
 ("Qué datos recogemos","Solo los datos que nos envías a través del formulario de contacto: nombre, empresa, correo o teléfono, tipo de servicio y mensaje. Si nos contactas por WhatsApp, teléfono o correo, también conservamos los datos de esa conversación."),
 ("Para qué usamos los datos","Exclusivamente para responder a tu solicitud y, si seguimos adelante, preparar y acompañar tu proyecto. No enviamos publicidad ni compartimos tus datos con fines de marketing."),
 ("Base jurídica","El tratamiento se basa en tu solicitud de contacto y en medidas precontractuales, conforme al Reglamento General de Protección de Datos (RGPD)."),
 ("Con quién los compartimos","El formulario lo procesa el servicio FormSubmit, que solo reenvía el mensaje a nuestro correo. No vendemos ni cedemos tus datos a terceros."),
 ("Cuánto tiempo los conservamos","El tiempo necesario para responder a tu solicitud y, si eres cliente, durante el plazo que exija la ley. Puedes pedir su eliminación en cualquier momento."),
 ("Tus derechos","Puedes solicitar el acceso, la rectificación, la supresión o la limitación de tus datos, y oponerte al tratamiento, escribiendo a <a href=\"mailto:geral@bagatela.pt\">geral@bagatela.pt</a>. También puedes presentar una reclamación ante la autoridad portuguesa de protección de datos (CNPD, <a href=\"https://www.cnpd.pt\">cnpd.pt</a>)."),
 ("Cookies","Este sitio no usa cookies publicitarias ni de seguimiento. Las fuentes se cargan desde Google Fonts."),
 ("Libro de Reclamaciones","Puedes presentar una reclamación en <a href=\"https://www.livroreclamacoes.pt\">livroreclamacoes.pt</a> (Portugal)."),
]),
}

def url(lang, page=""):
    return f"{SITE}/{'' if lang=='pt' else lang+'/'}{page}"

def hreflangs(page=""):
    out = [f'<link rel="alternate" hreflang="{HTML_LANG[l]}" href="{url(l,page)}">' for l in ["pt","en","fr","es"]]
    out.append(f'<link rel="alternate" hreflang="x-default" href="{url("pt",page)}">')
    return "\n".join(out)

def switcher(lang, page=""):
    def href(l):
        pre = "" if lang == "pt" else "../"
        tgt = ("" if l == "pt" else l + "/")
        if lang == l: return "./" + page if page else "./"
        return pre + tgt + page
    items = []
    for l in ["pt","en","fr","es"]:
        cur = ' aria-current="true"' if l == lang else ""
        items.append(f'<a href="{href(l)}" hreflang="{HTML_LANG[l]}" lang="{l}"{cur}>{l.upper()}</a>')
    return items

def tr(lang):
    i = IDX[lang]
    return {row[0]: row[i] for row in T}

def translate_index(src, lang):
    d = tr(lang)
    i = IDX[lang]
    pos = src.index("<header>")
    footer_end = src.index("</footer>") + len("</footer>")
    head, body, tail = src[:pos], src[pos:footer_end], src[footer_end:]

    # --- head: cadeias JSON-LD / meta / title
    for pt, t in d.items():
        j = t.replace("\\", "\\\\").replace('"', '\\"')
        head = head.replace(f'"{pt}"', f'"{j}"')
        head = head.replace(f'>{pt}<', f'>{t}<')
    head = head.replace('<html lang="pt-PT">', f'<html lang="{HTML_LANG[lang]}">')
    head = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url(lang)}">', head)
    head = head.replace('<meta property="og:url" content="https://www.bagatela.pt/">', f'<meta property="og:url" content="{url(lang)}">')
    alts = "".join(f'<meta property="og:locale:alternate" content="{OG_LOCALE[l]}">\n' for l in ["pt","en","fr","es"] if l != lang)
    head = re.sub(r'<meta property="og:locale" content="pt_PT">\n(<meta property="og:locale:alternate" content="[^"]*">\n?)+',
                  f'<meta property="og:locale" content="{OG_LOCALE[lang]}">\n' + alts, head)
    head = head.replace('href="favicon.svg"', 'href="../favicon.svg"')

    # --- body: nós de texto
    def text_sub(m):
        raw = m.group(2); core = raw.strip()
        if core in d:
            lead = raw[:len(raw)-len(raw.lstrip())]; trail = raw[len(raw.rstrip()):]
            return m.group(1) + lead + d[core] + trail + m.group(3)
        return m.group(0)
    body = re.sub(r'(>)([^<>]+)(<)', text_sub, body)
    def attr_sub(m):
        return m.group(1) + d.get(m.group(2), m.group(2)) + '"'
    body = re.sub(r'((?:aria-label|alt|placeholder)=")([^"]+)"', attr_sub, body)
    body = body.replace('name="idioma" value="pt"', f'name="idioma" value="{lang}"')
    # seletor de idioma
    sw = "\n      ".join(switcher(lang))
    body = re.sub(r'(<div class="idiomas"[^>]*>\s*).*?(\s*</div>)', lambda m: m.group(1) + sw + m.group(2), body, count=1, flags=re.S)
    # caminhos relativos
    body = body.replace('src="img/', 'src="../img/').replace('href="exemplos/', 'href="../exemplos/').replace('href="/"', 'href="./"')

    # --- JS
    for row in JS:
        tail = tail.replace(row[0], row[i].replace("'", "\\'"))
    return head + body + tail

def privacy_page(lang):
    P = PRIV[lang]
    parts = []
    for l in ["pt", "en", "fr", "es"]:
        if l == lang:
            h = "privacidade.html"
        else:
            h = ("../" if lang != "pt" else "") + ("" if l == "pt" else l + "/") + "privacidade.html"
        cur = ' aria-current="true"' if l == lang else ""
        parts.append(f'<a href="{h}" hreflang="{HTML_LANG[l]}" lang="{l}"{cur}>{l.upper()}</a>')
    sw = "".join(parts)
    home = "index.html" if lang == "pt" else "./"
    secs = "\n".join(f"<h2>{h}</h2>\n<p>{p}</p>" for h, p in P["secs"])
    fav = "favicon.svg" if lang == "pt" else "../favicon.svg"
    return f'''<!doctype html>
<html lang="{HTML_LANG[lang]}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{P["title"]} | Bagatela</title>
<meta name="robots" content="index, follow">
<link rel="canonical" href="{url(lang,"privacidade.html")}">
{hreflangs("privacidade.html")}
<link rel="icon" type="image/svg+xml" href="{fav}">
<style>
*{{box-sizing:border-box}}body{{margin:0;font:17px/1.7 system-ui,-apple-system,"Segoe UI",sans-serif;color:#3F4A5E;background:#F7F2E9}}
header{{background:#14101F;padding:1.2rem 0}}header .w{{display:flex;justify-content:space-between;align-items:center}}header a{{color:#fff;text-decoration:none;font-weight:700;font-size:1.3rem}}
.sw a{{font-size:.8rem;font-weight:600;padding:.3rem .55rem;border-radius:999px;color:rgba(255,255,255,.7)}}.sw a[aria-current]{{background:rgba(255,255,255,.16);color:#fff}}
.w{{max-width:760px;margin:0 auto;padding:0 1.4rem}}main{{padding:3rem 0 5rem}}
h1{{color:#0A0F1C;font-size:2.2rem;line-height:1.1;margin:0 0 .5rem}}h2{{color:#0A0F1C;font-size:1.3rem;margin:2.2rem 0 .5rem}}main a{{color:#6B46E5}}
.d{{color:#6b7689;font-size:.95rem}}
</style></head><body>
<header><div class="w"><a href="{home}">{P["back"]}</a><div class="sw">{sw}</div></div></header>
<main class="w">
<h1>{P["title"]}</h1>
<p class="d">{P["upd"]}</p>
{secs}
</main></body></html>
'''

def sitemap():
    rows = []
    for page in ["", "privacidade.html"]:
        for l in ["pt","en","fr","es"]:
            alts = "".join(f'\n    <xhtml:link rel="alternate" hreflang="{HTML_LANG[a]}" href="{url(a,page)}"/>' for a in ["pt","en","fr","es"])
            alts += f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{url("pt",page)}"/>'
            rows.append(f"  <url>\n    <loc>{url(l,page)}</loc>{alts}\n  </url>")
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
            + "\n".join(rows) + "\n</urlset>\n")

def write(path, txt):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, "w", encoding="utf-8").write(txt)

def main():
    src = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    for l in LANGS:
        write(f"{l}/index.html", translate_index(src, l))
    for l in ["pt"] + LANGS:
        write("privacidade.html" if l == "pt" else f"{l}/privacidade.html", privacy_page(l))
    write("sitemap.xml", sitemap())
    print("OK:", ", ".join(LANGS))

if __name__ == "__main__":
    main()
