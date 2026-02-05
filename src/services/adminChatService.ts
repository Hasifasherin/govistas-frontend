import API from "../utils/api";

// Get all operators (if you have this route)
export const getOperators = async () => {
  const res = await API.get("/admin/chat/operators");
  return res.data.operators;
};

// Get conversations (users chatting with operator)
export const getOperatorConversations = async (operatorId: string) => {
  const res = await API.get(`/admin/chat/${operatorId}`);
  return res.data.conversations;
};

// Get messages between operator & user
export const getOperatorUserMessages = async (
  operatorId: string,
  userId: string
) => {
  const res = await API.get(`/admin/chat/${operatorId}/${userId}`);
  return res.data.messages;
};
