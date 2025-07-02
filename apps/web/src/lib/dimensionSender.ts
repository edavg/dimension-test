import { useEffect } from "react";

export default function DimensionSender() {
  useEffect(() => {
    if (window.self === window.top) return;

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
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    const handleResize = () => setTimeout(sendDimensions, 100);
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
    };
  }, []);

  return null;
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
      console.log({
        dimensions: getDimensions(),
      });
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

export const initDimensionSender = () => {
  if (window.self === window.top) return;

  const getDimensions = () => {
    const body = document.body;
    const html = document.documentElement;

    return {
      width: Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth),
      height: Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight),
      scrollHeight: body.scrollHeight,
      scrollWidth: body.scrollWidth,
    };
  };

  const sendDimensions = () => {
    console.log({
      dimensions: getDimensions(),
    });
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

  window.addEventListener("resize", () => setTimeout(sendDimensions, 100));
};
