import type { Interview } from '@/shared/types/api';

interface TranscriptTabProps {
  session: Interview;
}

export function TranscriptTab({ session }: TranscriptTabProps) {
  if (!session.transcription) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">No transcription available</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-muted rounded-lg p-4">
        <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
          {session.transcription}
        </pre>
      </div>
    </div>
  );
}
