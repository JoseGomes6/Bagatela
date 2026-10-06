// Configuração do site. Alterar aqui (e voltar a correr `npm run build:site`).

export const CONTACT = {
  email: "bagatela.geral@gmail.com", // mais tarde: "geral@bagatela.pt" (quando o email do domínio estiver a funcionar)
  // Telemóveis e WhatsApp desativados por agora (ainda sem cartão). Para voltar a ativar:
  // descomentar aqui e nos locais marcados com "TELEFONE/WHATSAPP" (Contacto, Bot, seo, dados do site).
  // phone1: "917 385 546",
  // phone2: "932 904 463",
  // phone1Intl: "+351917385546",
  // phone2Intl: "+351932904463",
  // whatsapp: "https://wa.me/351917385546",
} as const;

/** Destino dos formulários (FormSubmit). Formulários enviados para o email geral. */
export const FORM_EMAIL = CONTACT.email;
export const FORM_ENDPOINT = `https://formsubmit.co/ajax/${FORM_EMAIL}`;

/**
 * Gerador de conceitos:
 *  - "local": regras no browser (grátis, sem servidor)
 *  - "off": secção escondida
 *  - "" ou URL: IA no servidor (api/generate-concept.ts), com as regras locais como plano B
 */
export const CONCEPT_API: string = "local";
