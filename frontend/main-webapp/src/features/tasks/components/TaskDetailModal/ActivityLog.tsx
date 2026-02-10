import { useState } from "react";
import type { ActivityItem, Comment } from "./types";
import { ActivityIcon } from "./ModalIcons";

interface ActivityLogProps {
  activities: ActivityItem[];
  comments: Comment[];
}

function ActivityEntry({ activity }: { activity: ActivityItem }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex-shrink-0 mt-1">
        <ActivityIcon />
      </div>
      <div className="flex-1">
        <p className="text-sm text-neutral-900">
          <span className="font-medium">{activity.user}</span>
          {" changed status to "}
          {activity.value && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-status-to_do/15 text-status-to_do text-xs font-medium">
              {activity.value}
            </span>
          )}
        </p>
        <p className="text-xs text-neutral-400 mt-1">{activity.timestamp}</p>
      </div>
    </div>
  );
}

function CommentEntry({ comment }: { comment: Comment }) {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 rounded-full bg-chart-3 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
        {comment.user.avatar ? (
          <img
            src={comment.user.avatar}
            alt={comment.user.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          getInitial(comment.user.name)
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-900">
            {comment.user.name}
          </span>
          <span className="text-xs text-neutral-400">{comment.timestamp}</span>
        </div>
        <p className="text-sm text-neutral-500 mt-1">{comment.content}</p>
      </div>
    </div>
  );
}

export default function ActivityLog({ activities, comments }: ActivityLogProps) {
  const [activeTab, setActiveTab] = useState<"activity" | "comments">("activity");

  return (
    <div className="flex flex-col">
      {/* Tab Headers */}
      <div className="flex items-center gap-6 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("activity")}
          className={`pb-2 text-sm font-medium transition-colors relative ${
            activeTab === "activity"
              ? "text-primary"
              : "text-neutral-400 hover:text-neutral-500"
          }`}
        >
          Activity Log
          {activeTab === "activity" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`pb-2 text-sm font-medium transition-colors relative ${
            activeTab === "comments"
              ? "text-primary"
              : "text-neutral-400 hover:text-neutral-500"
          }`}
        >
          Comments ({comments.length})
          {activeTab === "comments" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4 max-h-[200px] overflow-y-auto">
        {activeTab === "activity" ? (
          <div className="flex flex-col divide-y divide-neutral-100">
            {activities.map((activity) => (
              <ActivityEntry key={activity.id} activity={activity} />
            ))}
            {activities.length === 0 && (
              <p className="text-sm text-neutral-400 py-4">No activity yet</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-neutral-100">
            {comments.map((comment) => (
              <CommentEntry key={comment.id} comment={comment} />
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-neutral-400 py-4">No comments yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
