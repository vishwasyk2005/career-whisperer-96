import { useState } from "react";
import { GraduationCap, Wrench, Target, Navigation, AlertTriangle, Edit3, Check, X } from "lucide-react";
import { CareerSnapshot as CareerSnapshotType } from "@/types/career";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CareerSnapshotProps {
  snapshot: CareerSnapshotType;
  onUpdate: (updates: Partial<CareerSnapshotType>) => void;
}

export function CareerSnapshot({ snapshot, onUpdate }: CareerSnapshotProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (field: string, currentValue: string) => {
    setEditing(field);
    setEditValue(currentValue);
  };

  const handleSave = (field: keyof CareerSnapshotType) => {
    if (field === "skills" || field === "gaps") {
      onUpdate({ [field]: editValue.split(",").map(s => s.trim()).filter(Boolean) });
    } else {
      onUpdate({ [field]: editValue });
    }
    setEditing(null);
    setEditValue("");
  };

  const handleCancel = () => {
    setEditing(null);
    setEditValue("");
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Exploration": return "bg-blue-100 text-blue-700";
      case "Learning": return "bg-yellow-100 text-yellow-700";
      case "Applying": return "bg-green-100 text-green-700";
      case "Growing": return "bg-purple-100 text-purple-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const renderField = (
    icon: React.ReactNode,
    label: string,
    value: string | string[],
    field: keyof CareerSnapshotType
  ) => {
    const displayValue = Array.isArray(value) 
      ? value.length > 0 ? value.join(", ") : "None identified yet"
      : value || "Not specified";
    
    const isEditing = editing === field;

    return (
      <div className="flex items-start gap-3 group">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
          {isEditing ? (
            <div className="flex gap-1">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-7 text-sm"
                placeholder={Array.isArray(value) ? "Comma-separated values" : "Enter value"}
                autoFocus
              />
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleSave(field)}>
                <Check className="w-3.5 h-3.5 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleCancel}>
                <X className="w-3.5 h-3.5 text-red-600" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {field === "stage" ? (
                <Badge className={cn("text-xs", getStageColor(displayValue))}>
                  {displayValue}
                </Badge>
              ) : field === "skills" || field === "gaps" ? (
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(value) && value.length > 0 ? (
                    value.map((item, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">{displayValue}</span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-foreground">{displayValue}</p>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleEdit(field, Array.isArray(value) ? value.join(", ") : value)}
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
          <Target className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">Career Snapshot</h3>
          <p className="text-xs text-muted-foreground">Updates as we chat</p>
        </div>
      </div>

      <div className="space-y-4">
        {renderField(
          <GraduationCap className="w-4 h-4 text-blue-500" />,
          "Education",
          snapshot.education,
          "education"
        )}
        
        {renderField(
          <Wrench className="w-4 h-4 text-amber-500" />,
          "Skills",
          snapshot.skills,
          "skills"
        )}
        
        {renderField(
          <Target className="w-4 h-4 text-green-500" />,
          "Goal",
          snapshot.goal,
          "goal"
        )}
        
        {renderField(
          <Navigation className="w-4 h-4 text-purple-500" />,
          "Stage",
          snapshot.stage,
          "stage"
        )}
        
        {renderField(
          <AlertTriangle className="w-4 h-4 text-red-500" />,
          "Gaps to Address",
          snapshot.gaps,
          "gaps"
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
        💡 Click edit to update manually or let AI detect from chat
      </p>
    </div>
  );
}
