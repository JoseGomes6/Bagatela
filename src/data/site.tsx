// Conteúdo do site. Os textos estão em português; as outras línguas vêm de src/i18n/translations.ts.
import type { ReactNode } from "react";

export interface Service { icon: ReactNode; title: string; text: string }
export const SERVICES: Service[] = [
  { icon: <><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M11 18h2" /></>, title: "Pensado para telemóvel", text: "A maioria dos clientes procura no telemóvel. O teu site fica impecável em qualquer ecrã." },
  { icon: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>, title: "SEO para o Google", text: "Estrutura, velocidade, títulos e descrições otimizados para pesquisas na tua zona." },
  { icon: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />, title: "Rapidez a sério", text: "Páginas leves que abrem num instante, o que agrada aos clientes e ao Google." },
  { icon: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>, title: "Domínio e segurança", text: "Registamos o teu endereço .pt, configuramos o alojamento e o certificado SSL." },
  { icon: <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>, title: "Google Maps", text: "Criamos ou melhoramos o teu Perfil de Empresa para aparecer no mapa." },
  { icon: <path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />, title: "Contacto num toque", text: "Botões de chamada, WhatsApp e formulário para nunca perder um cliente." },
];

export const NICHES = ["Restauração", "Beleza e estética", "Comércio local", "Serviços técnicos", "Alojamento local", "Saúde e bem-estar", "Ginásios", "Oficinas"];

export interface Project { slug: string; mini: string; name: string; category: string; description: string }
export const PROJECTS: Project[] = [
  { slug: "restaurante", mini: "m1", name: "Restaurante O Farol", category: "Restauração", description: "Menu, reservas e horário à vista." },
  { slug: "beleza", mini: "m2", name: "Estúdio Rosa Beauty", category: "Beleza e estética", description: "Serviços, preços e marcações online." },
  { slug: "servicos", mini: "m3", name: "Canalizações Silva", category: "Serviços técnicos", description: "Zonas de serviço e contacto rápido." },
];

export interface Plan {
  id: "Essencial" | "Negócio" | "Loja Online";
  tag?: string; badge?: string; name: string; description: string; price: number; summary: string;
  features: string[]; delivery: string; cta: string; top?: boolean;
}
export const PLANS_DATA: Plan[] = [
  {
    id: "Essencial", tag: "Para começar", name: "Essencial", description: "Para marcar presença online.", price: 179,
    summary: "Site de uma página, ideal para começar.",
    features: ["Site de 1 página com até 5 secções", "Design adaptado a telemóvel e tablet", "Botões de chamada, WhatsApp e e-mail", "Mapa do Google Maps integrado", "Ligação às redes sociais", "SEO base: títulos, descrições e velocidade", "Registo no Google Search Console", "Certificado de segurança SSL", "Domínio .pt e alojamento no 1.º ano", "1 ronda de alterações"],
    delivery: "até 5 dias úteis", cta: "Quero o Essencial",
  },
  {
    id: "Negócio", badge: "Recomendado", name: "Negócio", description: "Melhor relação qualidade/preço.", price: 299, top: true,
    summary: "Até 5 páginas, com SEO local completo.",
    features: ["Tudo o que está no plano Essencial", "Até 5 páginas (ex.: Início, Serviços, Galeria, Sobre, Contactos)", "Galeria de fotografias", "Página de serviços com preços", "Formulário de contacto", "SEO local completo para a tua zona", "Criação do Perfil de Empresa no Google", "Estatísticas de visitas (Google Analytics)", "Política de privacidade e aviso de cookies (RGPD)", "2 rondas de alterações"],
    delivery: "até 10 dias úteis", cta: "Quero o Negócio",
  },
  {
    id: "Loja Online", tag: "E-commerce", name: "Loja Online", description: "Para vender 24 horas por dia.", price: 599,
    summary: "Loja completa com pagamentos portugueses.",
    features: ["Tudo o que está no plano Negócio", "Loja online com até 50 produtos", "Carrinho de compras e checkout", "Pagamentos por MB WAY, Multibanco e cartão", "Gestão de stock e portes de envio", "E-mails automáticos de confirmação de encomenda", "Página de termos e condições e devoluções", "1 hora de formação para gerir a loja", "3 rondas de alterações"],
    delivery: "até 15 dias úteis", cta: "Quero a Loja Online",
  },
];

export const MAINTENANCE_FEATURES = [
  "2 horas de alterações por mês (textos, fotos, preços)", "Atualizações de segurança", "Cópias de segurança semanais",
  "Monitorização do site 24 horas", "Relatório mensal de visitas e posição no Google", "Suporte prioritário" /* TELEFONE/WHATSAPP (desativado): "Suporte prioritário por WhatsApp" */,
];

export const EXTRAS: Array<[string, string]> = [
  ["Domínio .pt e alojamento (a partir do 2.º ano)", "89€/ano"], ["E-mail profissional (ex.: geral@oseunegocio.pt)", "24€/ano por conta"],
  ["Página adicional", "40€"], ["Redação de textos", "25€/página"], ["Logótipo simples", "79€"], ["Versão em inglês", "30€/página"],
  ["Pack de 50 produtos extra na loja", "49€"], ["Alterações avulsas (sem manutenção)", "25€/hora"],
];

export interface Faq { q: string; a: string }
/** Perguntas frequentes: usadas na página e nos dados estruturados (SEO). */
export const FAQS: Faq[] = [
  { q: "Quanto tempo demora a ter o site pronto?", a: "Na maioria dos casos o site fica online poucos dias depois de recebermos os textos e as fotografias." },
  { q: "O domínio e o alojamento estão incluídos?", a: "Tratamos do registo do domínio .pt e do alojamento. Os custos anuais aparecem de forma clara na proposta." },
  { q: "Posso pedir alterações depois?", a: "Sim. Podes pedir alterações avulsas a 25€/hora ou aderir à manutenção mensal opcional de 50€/mês, que inclui 2 horas de alterações por mês, além de atualizações de segurança, cópias de segurança, monitorização do site e relatório mensal." },
  { q: "O meu site vai aparecer no Google?", a: "Todos os sites seguem boas práticas de SEO: carregamento rápido, versão para telemóvel, títulos e descrições otimizados e registo no Google Search Console." },
  { q: "Não tenho textos nem fotografias. E agora?", a: "Ajudamos a escrever os textos e indicamos como tirar boas fotografias com o telemóvel. Também podemos usar imagens de bancos gratuitos ou, se preferires, arranjar um fotógrafo por um custo adicional." },
];

/** Perguntas do assistente (chat no canto inferior direito). */
export const BOT_QA: Faq[] = [
  { q: "Quanto custa?", a: "Temos 3 planos de pagamento único: Essencial 179€, Negócio 299€ e Loja Online 599€. A manutenção mensal é opcional, 50€/mês." },
  { q: "O que inclui cada plano?", a: "Essencial: site de 1 página com até 5 secções. Negócio: até 5 páginas com SEO local completo. Loja Online: loja com até 50 produtos e pagamentos por MB WAY, Multibanco e cartão. Na secção de preços podes ver tudo em detalhe." },
  { q: "Quanto tempo demora?", a: "Essencial até 5 dias úteis, Negócio até 10 e Loja Online até 15, a contar da receção dos textos e fotografias." },
  { q: "O domínio está incluído?", a: "Sim, o domínio .pt e o alojamento estão incluídos no 1.º ano. A partir do 2.º ano são 89€/ano." },
  { q: "Posso pedir alterações depois?", a: "Sim. Alterações avulsas custam 25€/hora, ou podes aderir à manutenção mensal de 50€/mês, que inclui 2 horas de alterações por mês, além de atualizações de segurança, cópias de segurança, monitorização do site e relatório mensal." },
  { q: "Não tenho textos nem fotografias. E agora?", a: "Sem problema: ajudamos a escrever os textos (25€/página) e indicamos como tirar boas fotografias com o telemóvel. Se preferires, arranjamos um fotógrafo por um custo adicional." },
  { q: "Como começo?", a: "Preenche o formulário e conta-nos o que precisas. Entramos em contacto contigo." },
  { q: "Como vos contacto?", a: "Usa o formulário ou escreve para bagatela.geral@gmail.com." },
  // TELEFONE/WHATSAPP (desativado):
  // { q: "Como começo?", a: "Preenche o formulário ou fala connosco por WhatsApp. Conta-nos o que precisas e entramos em contacto contigo." },
  // { q: "Como vos contacto?", a: "Podes ligar para 917 385 546 ou 932 904 463, escrever para geral@bagatela.pt ou usar o formulário." },
];
