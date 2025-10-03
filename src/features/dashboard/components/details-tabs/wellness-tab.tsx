import type { Interview } from '@/shared/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';

interface WellnessTabProps {
  session: Interview;
}

export function WellnessTab({ session }: WellnessTabProps) {
  if (!session.wellness_data || Object.keys(session.wellness_data).length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">No wellness data available</p>
      </div>
    );
  }

  const { wellness_data } = session;

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Wellness Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {wellness_data.age !== undefined && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Age</div>
                <div className="font-medium">{wellness_data.age} years</div>
              </div>
            )}
            {wellness_data.weight !== undefined && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Weight</div>
                <div className="font-medium">{wellness_data.weight} kg</div>
              </div>
            )}
            {wellness_data.height !== undefined && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Height</div>
                <div className="font-medium">{wellness_data.height} cm</div>
              </div>
            )}
            {wellness_data.stress_level !== undefined && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Stress Level</div>
                <div className="font-medium">{wellness_data.stress_level}/10</div>
              </div>
            )}
            {wellness_data.sleep_hours !== undefined && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Sleep Hours</div>
                <div className="font-medium">{wellness_data.sleep_hours}h per night</div>
              </div>
            )}
            {wellness_data.activity_level && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Activity Level</div>
                <div className="font-medium capitalize">{wellness_data.activity_level}</div>
              </div>
            )}
          </div>

          {wellness_data.goals && wellness_data.goals.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-muted-foreground mb-2">Goals</div>
              <div className="flex flex-wrap gap-2">
                {wellness_data.goals.map((goal, idx) => (
                  <Badge key={idx} variant="secondary">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Display any other custom fields */}
          {Object.entries(wellness_data).map(([key, value]) => {
            if (
              ['age', 'weight', 'height', 'stress_level', 'sleep_hours', 'activity_level', 'goals'].includes(key)
            ) {
              return null;
            }
            return (
              <div key={key} className="mt-4">
                <div className="text-xs text-muted-foreground mb-1 capitalize">
                  {key.replace(/_/g, ' ')}
                </div>
                <div className="font-medium">{String(value)}</div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
