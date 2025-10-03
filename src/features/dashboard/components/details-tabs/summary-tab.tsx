import type { Interview } from '@/shared/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';

interface SummaryTabProps {
  session: Interview;
}

export function SummaryTab({ session }: SummaryTabProps) {
  if (!session.summary) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">No summary available</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{session.summary}</p>
        </CardContent>
      </Card>
    </div>
  );
}
