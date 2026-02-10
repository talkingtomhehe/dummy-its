import PositionCard, { type Position } from "./PositionCard";

interface PositionTreeViewProps {
  rootPosition: Position;
  onPositionClick?: (position: Position) => void;
}

export default function PositionTreeView({
  rootPosition,
  onPositionClick,
}: PositionTreeViewProps) {
  const children = rootPosition.children || [];
  
  // Find vacant positions (children of children)
  const getVacantPositions = (positions: Position[]): Position[] => {
    return positions.flatMap((pos) => {
      const vacant: Position[] = [];
      if (pos.isVacant) vacant.push(pos);
      if (pos.children) vacant.push(...getVacantPositions(pos.children));
      return vacant;
    });
  };

  const vacantPositions = children.flatMap((child) => 
    child.children ? getVacantPositions(child.children) : []
  );

  return (
    <div className="relative w-full min-h-[500px] overflow-x-auto py-4">
      {/* Tree Container - Centered with max-width for laptop */}
      <div className="relative mx-auto" style={{ minWidth: "fit-content" }}>
        {/* Root Position - Centered */}
        <div className="flex justify-center mb-8">
          <PositionCard
            position={rootPosition}
            isRoot
            onClick={() => onPositionClick?.(rootPosition)}
          />
        </div>

        {/* Vertical Line from Root */}
        {children.length > 0 && (
          <div className="absolute left-1/2 top-[140px] w-0.5 h-[80px] bg-neutral-200 -translate-x-1/2" />
        )}

        {/* Horizontal Line connecting children */}
        {children.length > 1 && (
          <div 
            className="absolute top-[220px] h-0.5 bg-neutral-200"
            style={{
              left: `calc(50% - ${(children.length - 1) * 175}px)`,
              width: `${(children.length - 1) * 350}px`,
            }}
          />
        )}

        {/* Children Level */}
        {children.length > 0 && (
          <div className="flex justify-center gap-6 mt-[100px]">
            {children.map((child) => (
              <div key={child.id} className="relative flex flex-col items-center">
                {/* Vertical line to child */}
                <div className="absolute -top-[20px] left-1/2 w-0.5 h-[20px] bg-neutral-200 -translate-x-1/2" />
                
                <PositionCard
                  position={child}
                  onClick={() => onPositionClick?.(child)}
                />

                {/* Vertical line to grandchildren if any */}
                {child.children && child.children.length > 0 && (
                  <div className="absolute top-[117px] left-1/2 w-0.5 h-[80px] bg-neutral-200 -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Vacant Positions Level (Third Level) */}
        {vacantPositions.length > 0 && (
          <div className="flex justify-start gap-6 mt-[100px] pl-4">
            {vacantPositions.map((vacant) => (
              <PositionCard
                key={vacant.id}
                position={vacant}
                onClick={() => onPositionClick?.(vacant)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
