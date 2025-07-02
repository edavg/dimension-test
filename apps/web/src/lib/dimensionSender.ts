import { useEffect } from "react";

export default function DimensionSender() {
  useEffect(() => {
    // Verificar si estamos en un iframe
    if (window.self === window.top) return;

    // Función para obtener dimensiones
    const getDimensions = () => {
      const body = document.body;
      const html = document.documentElement;

      return {
        width: Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth),
        height: Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight
        ),
        scrollHeight: body.scrollHeight,
        scrollWidth: body.scrollWidth,
        clientWidth: html.clientWidth,
        clientHeight: html.clientHeight,
      };
    };

    // Función para enviar dimensiones al padre
    const sendDimensions = () => {
      const dimensions = getDimensions();

      window.parent.postMessage(
        {
          type: "iframe_dimensions",
          dimensions: dimensions,
          timestamp: new Date().toISOString(),
          source: "iframe",
        },
        "*"
      );
    };

    // Enviar dimensiones iniciales
    setTimeout(sendDimensions, 100);

    // Escuchar solicitudes del padre
    const handleParentMessage = (event: any) => {
      if (event.data?.type === "request_dimensions") {
        sendDimensions();
      }
    };
    window.addEventListener("message", handleParentMessage);

    // Observer para cambios en el contenido
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(sendDimensions, 100);
    });

    // Observar el body
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    // Observer para mutaciones del DOM
    const mutationObserver = new MutationObserver(() => {
      setTimeout(sendDimensions, 100);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Listener para resize de ventana
    const handleResize = () => setTimeout(sendDimensions, 100);
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
      window.removeEventListener("message", handleParentMessage);
    };
  }, []);

  return null; // No renderiza nada
}

export function useDimensionSender() {
  useEffect(() => {
    const getDimensions = () => {
      const body = document.body;
      const html = document.documentElement;

      return {
        width: Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth),
        height: Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight
        ),
        scrollHeight: body.scrollHeight,
        scrollWidth: body.scrollWidth,
      };
    };

    const sendDimensions = () => {
      window.parent.postMessage(
        {
          type: "iframe_dimensions",
          dimensions: getDimensions(),
          timestamp: new Date().toISOString(),
        },
        "*"
      );
    };

    setTimeout(sendDimensions, 100);

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(sendDimensions, 100);
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    const mutationObserver = new MutationObserver(() => {
      setTimeout(sendDimensions, 100);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const handleResize = () => setTimeout(sendDimensions, 100);
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}
