import { Activity, Server, Bot } from 'lucide-react';
import { useSystemStatus } from '../api/use-health';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';

export function HealthStatus() {
  const { data: status, refetch } = useSystemStatus();

  return (
    <div className="flex items-center gap-4">
      <Button
        size="sm"
        variant="outline"
        onClick={() => refetch()}
        className="flex items-center gap-2"
      >
        <Server className="h-4 w-4" />
        <span className="hidden sm:inline">API Server</span>
        <div
          className={`w-2 h-2 rounded-full ${
            status?.server ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-xs">{status?.server ? 'Online' : 'Offline'}</span>
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => refetch()}
        className="flex items-center gap-2"
      >
        <Bot className="h-4 w-4" />
        <span className="hidden sm:inline">Bot</span>
        <div
          className={`w-2 h-2 rounded-full ${status?.bot ? 'bg-green-500' : 'bg-red-500'}`}
        />
        <span className="text-xs">{status?.bot ? 'Online' : 'Offline'}</span>
      </Button>
    </div>
  );
}
