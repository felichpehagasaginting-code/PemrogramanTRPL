/**
 * Multi-Agent Architecture API
 * Foundation untuk sistem multi-agent seperti dijelaskan di agents.md
 *
 * Setiap agent adalah modul terisolasi yang bisa dipanggil oleh orchestrator
 * untuk mengeksekusi task spesifik secara paralel.
 */

export type AgentRole =
  | "orchestrator"
  | "analyst"
  | "frontend"
  | "backend"
  | "security"
  | "content";

export type AgentStatus = "idle" | "running" | "completed" | "failed" | "blocked";

export type TaskPriority = "critical" | "high" | "medium" | "low";

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  assignedTo: AgentRole;
  priority: TaskPriority;
  dependsOn: string[];
  status: AgentStatus;
  deliverable?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AgentMessage {
  from: AgentRole;
  to: AgentRole;
  type: "task_assignment" | "review_request" | "status_update" | "blocker" | "approval";
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface AgentReport {
  agentId: AgentRole;
  status: AgentStatus;
  completedTasks: number;
  failedTasks: number;
  blockedOn: string[];
  metrics: {
    linesOfCode?: number;
    filesChanged?: number;
    testCoverage?: number;
    securityIssues?: number;
  };
}

class AgentOrchestrator {
  private tasks: Map<string, AgentTask> = new Map();
  private agents: Map<AgentRole, AgentStatus> = new Map();
  private taskQueue: AgentTask[] = [];

  constructor() {
    const roles: AgentRole[] = ["orchestrator", "analyst", "frontend", "backend", "security", "content"];
    roles.forEach((role) => this.agents.set(role, "idle"));
  }

  createTask(task: Omit<AgentTask, "id" | "createdAt" | "status">): AgentTask {
    const newTask: AgentTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: "idle",
      createdAt: new Date().toISOString(),
    };
    this.tasks.set(newTask.id, newTask);
    return newTask;
  }

  getAgentStatus(role: AgentRole): AgentStatus {
    return this.agents.get(role) || "idle";
  }

  getTask(taskId: string): AgentTask | undefined {
    return this.tasks.get(taskId);
  }

  getBlockedTasks(): AgentTask[] {
    return Array.from(this.tasks.values()).filter((t) => t.status === "blocked");
  }

  getTasksByAgent(role: AgentRole): AgentTask[] {
    return Array.from(this.tasks.values()).filter((t) => t.assignedTo === role);
  }

  generateReport(): AgentReport[] {
    const reports: AgentReport[] = [];
    this.agents.forEach((status, role) => {
      const roleTasks = this.getTasksByAgent(role);
      reports.push({
        agentId: role,
        status,
        completedTasks: roleTasks.filter((t) => t.status === "completed").length,
        failedTasks: roleTasks.filter((t) => t.status === "failed").length,
        blockedOn: roleTasks.filter((t) => t.status === "blocked").map((t) => t.id),
        metrics: {},
      });
    });
    return reports;
  }
}

export const orchestrator = new AgentOrchestrator();
