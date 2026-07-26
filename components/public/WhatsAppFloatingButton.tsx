import styles from './WhatsAppFloatingButton.module.css';

export function WhatsAppFloatingButton({ whatsappNumber }: { whatsappNumber?: string }) {
  if (!whatsappNumber) return null;

  const digits = whatsappNumber.replace(/[^\d]/g, '');

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="Chat with us on WhatsApp"
    >
      WhatsApp
    </a>
  );
}
