import type Lenis from "lenis";

// Instância única da rolagem suave (Lenis). Fica nula quando a pessoa pede
// "reduzir movimento": aí a página usa a rolagem nativa do navegador.
export const rolagem: { lenis: Lenis | null } = { lenis: null };

// O hero avisa o header se ele está em cima da foto (texto claro, sem fundo)
// ou em cima do fundo claro da página (texto escuro, com fundo).
export const EVENTO_TOPO = "rancho:sobre-foto";

export function avisarSobreFoto(sobreFoto: boolean) {
  window.dispatchEvent(new CustomEvent(EVENTO_TOPO, { detail: sobreFoto }));
}
