import { Button, StatePanel } from '../../components/ui';
import { ProjectIdentity } from '../../components/project-identity';
import { SignOutButton } from '../auth';

interface PermissionDeniedStateProps {
  onReturnToOverview?: () => void;
  showProjectIdentity?: boolean;
}

export function PermissionDeniedState({
  onReturnToOverview,
  showProjectIdentity = false,
}: PermissionDeniedStateProps) {
  return (
    <>
      {showProjectIdentity ? <ProjectIdentity variant="panel" /> : null}
      <StatePanel
        actions={
          <>
            {onReturnToOverview ? (
              <Button onClick={onReturnToOverview} type="button" variant="secondary">
                Return to Overview
              </Button>
            ) : null}
            <SignOutButton />
          </>
        }
        description="You do not have permission to access this area."
        label="Permission required"
        title="Access denied"
        tone="warning"
      />
    </>
  );
}
