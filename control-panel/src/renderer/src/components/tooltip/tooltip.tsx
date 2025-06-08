import { useRef, useState, useEffect, type JSX } from 'react';
import styles from './styles.module.scss';

type ChildElement = JSX.Element | string | number | boolean | null | undefined;

interface ToolTipProps {
  tip: string;
  children: ChildElement;
}

export function ToolTip({ children, tip }: ToolTipProps) {
  const toolTipRef = useRef<HTMLDivElement | null>(null);
  const [showToolTip, setShowToolTip] = useState(false);
  const [translate, setTranslate] = useState<{ x: string; y: string }>({
    x: '-100%',
    y: '-100%'
  });
  useEffect(() => {
    const subjectElement = getPreviousSibling();
    const cleanUpFunctions: Array<Function> = [];

    if (subjectElement) {
      const pollSubject = setInterval(() => {
        const { left, bottom } = subjectElement.getBoundingClientRect();
        const translateX = left + 'px';
        const translateY = bottom + 'px';
        setTranslate({ x: translateX, y: translateY });
      }, 10);

      const clearPollInterval = () => {
        clearInterval(pollSubject);
      };

      cleanUpFunctions.push(clearPollInterval);

      const onMouseEnter = () => {
        setShowToolTip(true);
      };

      const onMouseLeave = () => {
        setShowToolTip(false);
      };

      subjectElement.addEventListener('mouseenter', onMouseEnter);
      subjectElement.addEventListener('mouseleave', onMouseLeave);

      const removeMouseEnter = () =>
        subjectElement.removeEventListener('mouseenter', onMouseEnter);

      const removeMouseLeave = () =>
        subjectElement.removeEventListener('mouseleave', onMouseLeave);

      cleanUpFunctions.push(...[removeMouseEnter, removeMouseLeave]);
    }

    return () => {
      cleanUpFunctions.forEach((cleanup) => cleanup());
    };

    function getPreviousSibling() {
      const siblings = Array.from(
        toolTipRef.current?.parentNode?.children || []
      );
      for (let i = 0; i < siblings.length - 1; i++) {
        if (siblings[i + 1] === toolTipRef.current) {
          return siblings[i];
        }
      }
      return undefined;
    }
  }, [children]);

  return (
    <>
      {children}
      {
        <div
          ref={toolTipRef}
          className={styles.tool_tip}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            visibility: showToolTip ? 'visible' : 'hidden',
            transform: `translate(${translate.x}, ${translate.y})`
          }}
        >
          {tip}
        </div>
      }
    </>
  );
}
