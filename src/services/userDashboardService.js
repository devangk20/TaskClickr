export const fetchUserTaskStats = async (userId) => {
    const response = await fetch(`/api/user/tasks?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch task stats: ${response.status}`);
    }
    return await response.json();
  };
  