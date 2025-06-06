import styles from './styles.module.scss';

type MessageProps = {
  text: string;
  hide?: boolean;
};

export function Message({ text, hide }: MessageProps) {
  return (
    <span className={hide ? styles.hidden_message : styles.message}>
      {text}
    </span>
  );
}
