import { useRef, useState, useEffect, type JSX } from 'react';
import styles from './styles.module.scss';

type ChildElement = JSX.Element | string | number | boolean | null | undefined;

/**
 * Props accepted by the {@link ToolTip} component.
 */
interface ToolTipProps {
  /**
   * The text to display to the user when the tooltip is visible.
   */
  text: string;
  /**
   * The child element that the tooltip describes.
   */
  children: ChildElement;
  /**
   * The placement of the tooltip relative to the child element.
   */
  placement: 'above' | 'below' | 'left' | 'right';
}

/**
 * Renders a stylized tooltip next to the child element. The tooltip becomes
 * visible when the user hovers over the child element. The position of the
 * tooltip relative to the child element can be set with the `placement` prop.
 *
 * @remarks
 * The `children` prop of this component is limited to exactly one child
 * element. Tooltips should not enclose other tooltips.
 *
 * @param props {@link ToolTipProps}
 */
export function ToolTip({ children, text, placement }: ToolTipProps) {
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
        const { top, left, bottom, right } =
          subjectElement.getBoundingClientRect();
        let translateX: string, translateY: string;
        switch (placement) {
          case 'above':
            translateX = left + 'px';
            translateY = `calc(${top}px - 100%)`;
            break;
          case 'below':
            translateX = left + 'px';
            translateY = bottom + 'px';
            break;
          case 'left':
            translateX = `calc(${left}px - 100%)`;
            translateY = top + 'px';
            break;
          case 'right':
            translateX = right + 'px';
            translateY = top + 'px';
            break;
        }
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
          className={styles.tooltip}
          style={{
            visibility: showToolTip ? 'visible' : 'hidden',
            transform: `translate(${translate.x}, ${translate.y})`
          }}
        >
          {text}
        </div>
      }
    </>
  );
}
