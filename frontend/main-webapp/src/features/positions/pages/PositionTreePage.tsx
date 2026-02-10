import { useState } from "react";
import {
  PositionToolbar,
  PositionTreeView,
  PositionListView,
  AddPositionModal,
  AddIcon,
  ChevronDoubleRightIcon,
  type Position,
  type Department,
  type Employee,
} from "../components";

// Mock data for Tree View
const mockPositionTree: Position = {
  id: "1",
  name: "Alex",
  title: "Chief Executive Officer",
  status: "primary",
  subordinateCount: 3,
  children: [
    {
      id: "2",
      name: "Alex",
      title: "Chief Executive Officer",
      status: "on_track",
    },
    {
      id: "3",
      name: "Alex",
      title: "Chief Executive Officer",
      status: "on_track",
    },
    {
      id: "4",
      name: "Alex",
      title: "Chief Executive Officer",
      status: "off_track",
    },
  ],
};

// Separate vacant position for display
const vacantPosition: Position = {
  id: "5",
  name: "Vacant Position",
  title: "Frontend Dev",
  isVacant: true,
};

// Mock data for List View (based on Figma design)
const mockDepartments: Department[] = [
  {
    id: "marketing",
    name: "Marketing",
    employees: [
      {
        id: "emp-1",
        name: "John Nguyen",
        workPhone: "0987654321",
        workEmail: "john.nguyen@gmail.com",
        jobPosition: "Manager",
        manager: {
          id: "mgr-1",
          name: "Alex Nguyen",
        },
      },
      {
        id: "emp-2",
        name: "Unassigned",
        jobPosition: "Marketing Design",
        isVacant: true,
        manager: {
          id: "mgr-1",
          name: "Alex Nguyen",
        },
      },
    ],
  },
  {
    id: "it",
    name: "IT",
    employees: [
      {
        id: "emp-3",
        name: "Sarah Chen",
        workPhone: "0912345678",
        workEmail: "sarah.chen@gmail.com",
        jobPosition: "Senior Developer",
        manager: {
          id: "mgr-2",
          name: "Mike Wilson",
        },
      },
      {
        id: "emp-4",
        name: "Tom Brown",
        workPhone: "0923456789",
        workEmail: "tom.brown@gmail.com",
        jobPosition: "Junior Developer",
        manager: {
          id: "mgr-2",
          name: "Mike Wilson",
        },
      },
    ],
  },
];

export default function PositionTreePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "list">("list");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleFilter = () => {
    // TODO: Implement filter modal
    console.log("Filter clicked");
  };

  const handleAddPosition = () => {
    setIsAddModalOpen(true);
  };

  const handleCreatePosition = (data: {
    jobTitle: string;
    department: string;
    reportsTo: string;
    employmentType: "full-time" | "part-time" | "contract";
    isVacant: boolean;
    assignedUser: string;
  }) => {
    console.log("Creating position:", data);
    // TODO: Call API to create position
    setIsAddModalOpen(false);
  };

  const handlePositionClick = (position: Position) => {
    // TODO: Navigate to position detail or open modal
    console.log("Position clicked:", position);
  };

  const handleEmployeeClick = (employee: Employee) => {
    // TODO: Navigate to employee detail or open modal
    console.log("Employee clicked:", employee);
  };

  // Calculate stats from departments
  const totalPositions = mockDepartments.reduce(
    (sum, dept) => sum + dept.employees.length,
    0
  );
  const vacantPositions = mockDepartments.reduce(
    (sum, dept) => sum + dept.employees.filter((e) => e.isVacant).length,
    0
  );

  return (
    <div className="relative w-full max-w-full mx-auto">
      {/* Sidebar Collapse Toggle - Fixed Position */}
      {/* <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-10 bg-primary/20 rounded-r-[20px] p-1.5 hover:bg-primary/30 transition-colors"
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <div className={`transition-transform ${isSidebarCollapsed ? "" : "rotate-180"}`}>
          <ChevronDoubleRightIcon />
        </div>
      </button> */}

      {/* Toolbar */}
      <div className="mb-2">
        <PositionToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilter={handleFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Main Content Area */}
      {viewMode === "tree" ? (
        // Tree View Layout
        <div className="relative">
          {/* Stats and Add Button Row */}
          <div className="flex items-center justify-between mb-2">
            {/* Stats Box */}
            <div className="bg-white border border-primary rounded-[8px] p-2">
              <div className="text-sm font-bold leading-5">
                <span className="text-neutral-500">
                  Total Position:{" "}
                  <span className="text-primary">{totalPositions}</span>
                </span>
                <span className="ml-4 text-neutral-500">
                  Vacant:{" "}
                  <span className="text-status-off_track">{vacantPositions}</span>
                </span>
              </div>
            </div>

            {/* Add Position Button */}
            <button
              onClick={handleAddPosition}
              className="bg-secondary border border-primary rounded-[8px] flex items-center gap-2 px-3 py-1.5 hover:bg-secondary/80 transition-colors"
            >
              <AddIcon />
              <span className="text-primary font-medium text-sm">Add Position</span>
            </button>
          </div>

          {/* Tree View */}
          <div className="pt-2">
            <PositionTreeView
              rootPosition={mockPositionTree}
              onPositionClick={handlePositionClick}
            />

            {/* Vacant Position - Connected below first child */}
            <div className="relative mt-4 ml-[40px]">
              {/* Vertical connector line */}
              <div className="absolute -top-4 left-[100px] w-0.5 h-4 bg-neutral-200" />

              <div className="inline-block">
                <div
                  onClick={() => handlePositionClick(vacantPosition)}
                  className="bg-white border border-dashed border-black rounded-[12px] shadow-sm 
                    flex items-center gap-3 px-4 py-3 cursor-pointer hover:shadow-md transition-shadow
                    w-[220px] h-[70px]"
                >
                  <div className="w-[50px] h-[50px] rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="4" stroke="#90A1B9" strokeWidth="2" />
                      <path d="M4 20C4 16.6863 7.13401 14 11 14H13C16.866 14 20 16.6863 20 20" stroke="#90A1B9" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-bold leading-[18px] text-neutral-400">
                      Vacant Position
                    </p>
                    <p className="text-xs font-medium leading-4 text-neutral-400">
                      Frontend Dev
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // List View Layout (Figma design)
        <div className="w-full bg-white rounded-[12px] overflow-hidden">
          {/* Stats Bar with Add Button */}
          <div className="bg-neutral-50 border border-neutral-200 flex flex-wrap items-center gap-4 p-2">
            <span className="text-sm font-bold text-neutral-500">
              Total Position:{" "}
              <span className="text-primary">{totalPositions}</span>
            </span>
            <span className="text-sm font-bold text-neutral-500">
              Vacant:{" "}
              <span className="text-status-off_track">{vacantPositions}</span>
            </span>
            <button
              onClick={handleAddPosition}
              className="bg-secondary border border-primary rounded-[8px] flex items-center gap-2 px-3 py-1.5 hover:bg-secondary/80 transition-colors ml-auto"
            >
              <AddIcon />
              <span className="text-primary font-medium text-sm whitespace-nowrap">
                Add Position
              </span>
            </button>
          </div>

          {/* List View Table */}
          <PositionListView
            departments={mockDepartments}
            onEmployeeClick={handleEmployeeClick}
            selectedEmployees={selectedEmployees}
            onSelectionChange={setSelectedEmployees}
          />
        </div>
      )}

      {/* Add Position Modal */}
      <AddPositionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreatePosition}
      />
    </div>
  );
}
