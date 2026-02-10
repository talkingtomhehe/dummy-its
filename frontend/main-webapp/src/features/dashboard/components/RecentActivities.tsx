interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

// History Icon
const HistoryIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 8V12L15 15"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.05 11C3.27151 8.6804 4.32728 6.51398 6.02871 4.89873C7.73013 3.28348 9.96164 2.33251 12.2898 2.22411C14.618 2.11571 16.8895 2.85738 18.6663 4.30497C20.4431 5.75255 21.6017 7.80379 21.926 10.052C22.2503 12.3002 21.7175 14.5894 20.4326 16.4667C19.1477 18.3439 17.2001 19.6707 14.9999 20.1857C12.7997 20.7007 10.4928 20.3647 8.53103 19.2403C6.56925 18.1159 5.09101 16.2797 4.39998 14.1"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 4V11H10"
      stroke="#62748E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function RecentActivities({
  activities,
}: RecentActivitiesProps) {
  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-neutral-100 p-3 lg:p-4 flex flex-col relative min-h-[200px]">
      {/* Timeline line */}
      <div className="absolute left-[22px] lg:left-[26px] top-[30px] bottom-[60px] w-0.5 bg-neutral-200" />

      {/* Activity Items */}
      <div className="flex flex-col gap-4 relative z-10">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-2.5">
            {/* Timeline dot */}
            <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0 mt-0.5" />

            {/* Content */}
            <div className="flex flex-col gap-1">
              <p className="text-xs leading-4">
                <span className="font-medium text-black">{activity.user} </span>
                <span className="font-normal text-black">{activity.action} </span>
                <span className="font-medium text-primary">{activity.target}</span>
                <span className="font-medium text-black">.</span>
              </p>
              <span className="font-medium text-xs leading-4 text-neutral-400">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View All History Button */}
      <div className="mt-auto pt-3">
        <button className="w-full flex items-center justify-center gap-2 bg-neutral-50 border border-neutral-200 rounded-[12px] px-4 py-1.5 hover:bg-neutral-100 transition-colors">
          <HistoryIcon />
          <span className="font-medium text-xs leading-4 text-neutral-500">
            View all history
          </span>
        </button>
      </div>
    </div>
  );
}
