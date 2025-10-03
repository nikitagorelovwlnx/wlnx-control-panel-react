import { CoachesConfiguration } from '@/features/coaches/components/coaches-configuration';

export function CoachesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Coaches Configuration</h2>
        <p className="text-muted-foreground">
          Manage coach profiles and their prompt configurations
        </p>
      </div>

      <CoachesConfiguration />
    </div>
  );
}
