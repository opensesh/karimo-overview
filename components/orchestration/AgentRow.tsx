import { ShieldTick, Tool02, Users01 } from "@untitledui/icons";
import { agentAssignments, type AgentRole } from "@/lib/constants";

const AGENT_ICON: Record<AgentRole, typeof ShieldTick> = {
  coordinator: ShieldTick,
  "sub-agent": Tool02,
  team: Users01,
};

// Color scheme per role — visible chip styling
const AGENT_STYLES: Record<AgentRole, { bg: string; border: string; text: string }> = {
  coordinator: {
    bg: "rgba(254, 81, 2, 0.12)",
    border: "rgba(254, 81, 2, 0.30)",
    text: "#ff7a38",
  },
  "sub-agent": {
    bg: "rgba(168, 162, 158, 0.10)",
    border: "rgba(168, 162, 158, 0.25)",
    text: "#a8a29e",
  },
  team: {
    bg: "rgba(59, 130, 246, 0.10)",
    border: "rgba(59, 130, 246, 0.25)",
    text: "#60a5fa",
  },
};

interface AgentRowProps {
  phaseStep: string;
  compact?: boolean;
}

export function AgentRow({ phaseStep, compact = false }: AgentRowProps) {
  const agents = agentAssignments[phaseStep];
  if (!agents?.length) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-1 mt-1">
        {agents.map((agent, i) => {
          const Icon = AGENT_ICON[agent.role];
          const styles = AGENT_STYLES[agent.role];
          return (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: styles.bg,
                border: `1px solid ${styles.border}`,
              }}
              title={`${agent.name} (${agent.role})`}
            >
              <Icon width={11} height={11} style={{ color: styles.text }} />
              <span
                className="text-[9px] leading-none"
                style={{ fontFamily: "var(--font-mono, monospace)", color: styles.text }}
              >
                {agent.name}
              </span>
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      {agents.map((agent, i) => {
        const Icon = AGENT_ICON[agent.role];
        const styles = AGENT_STYLES[agent.role];
        return (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md"
            style={{
              backgroundColor: styles.bg,
              border: `1px solid ${styles.border}`,
            }}
          >
            <Icon width={12} height={12} style={{ color: styles.text }} />
            <span
              className="text-[10px] leading-none font-medium"
              style={{ fontFamily: "var(--font-mono, monospace)", color: styles.text }}
            >
              {agent.name}
            </span>
          </span>
        );
      })}
    </div>
  );
}

// Exported for use in legend
export { AGENT_ICON, AGENT_STYLES };
