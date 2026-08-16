import type { Inquiry } from '@/types/api';
import { StatusChip } from './StatusChip';
import { ReplyComposer } from './ReplyComposer';
import { SectionCard } from './SectionCard';
import styles from './InquiryDetailPanel.module.css';

interface InquiryDetailPanelProps {
  inquiry: Inquiry;
  onReply: (body: string) => Promise<void>;
}

export function InquiryDetailPanel({ inquiry, onReply }: InquiryDetailPanelProps) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.name}>{inquiry.name}</h1>
          <p className={styles.contact}>
            {inquiry.email}
            {inquiry.phone ? ` · ${inquiry.phone}` : ''}
          </p>
        </div>
        <StatusChip status={inquiry.status} kind="inquiry" />
      </div>

      <SectionCard icon={<MessageIcon />} accent="navy" title="Message">
        <p className={styles.message}>{inquiry.message}</p>
      </SectionCard>

      {inquiry.replies.length > 0 && (
        <SectionCard icon={<HistoryIcon />} accent="mixed" title="Replies">
          <ol className={styles.timeline}>
            {inquiry.replies.map((reply, i) => (
              <li key={i} className={styles.entry}>
                <span className={styles.dot} />
                <div className={styles.entryContent}>
                  <p className={styles.replyBody}>{reply.message}</p>
                  <span className={styles.meta}>
                    {reply.sentBy.name ?? 'Staff'} · {new Date(reply.date).toLocaleString('en-ZA')}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>
      )}

      <SectionCard icon={<SendIcon />} accent="gold" title="Send a reply">
        <ReplyComposer onSubmit={onReply} />
      </SectionCard>
    </div>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
