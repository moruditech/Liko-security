import type { Inquiry } from '@/types/api';
import { StatusChip } from './StatusChip';
import { ReplyComposer } from './ReplyComposer';
import styles from './InquiryDetailPanel.module.css';

interface InquiryDetailPanelProps {
  inquiry: Inquiry;
  onReply: (body: string) => Promise<void>;
}

export function InquiryDetailPanel({ inquiry, onReply }: InquiryDetailPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>{inquiry.name}</h2>
        <StatusChip status={inquiry.status} kind="inquiry" />
      </div>
      <p>{inquiry.email}</p>
      {inquiry.phone && <p>{inquiry.phone}</p>}

      <div className={styles.message}>
        <p>{inquiry.message}</p>
      </div>

      {inquiry.replies.length > 0 && (
        <div className={styles.replies}>
          <h3>Replies</h3>
          {inquiry.replies.map((reply, i) => (
            <div key={i} className={styles.reply}>
              <p>{reply.body}</p>
              <span>{new Date(reply.repliedAt).toLocaleString('en-ZA')}</span>
            </div>
          ))}
        </div>
      )}

      <ReplyComposer onSubmit={onReply} />
    </div>
  );
}
