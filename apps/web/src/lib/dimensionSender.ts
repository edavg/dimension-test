import { useEffect } from "react";

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
