import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, FriendRequest, Friend } from "@/types";
import { Video, Search, MoreHorizontal, Gift } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

const RightSidebar = () => {
  // In a real app, this would be based on authentication
  const currentUserId = 1;
  
  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users']
  });
  
  const { data: friendRequests } = useQuery<FriendRequest[]>({
    queryKey: [`/api/users/${currentUserId}/friend-requests`],
  });
  
  const { data: friends } = useQuery<Friend[]>({
    queryKey: [`/api/users/${currentUserId}/friends`],
  });

  const updateFriendRequestMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      await apiRequest('PATCH', `/api/friends/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/friend-requests`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/friends`] });
    }
  });

  const handleFriendRequest = (id: number, status: 'accepted' | 'rejected') => {
    updateFriendRequestMutation.mutate({ id, status });
  };

  // For now we'll simulate online status for contacts
  const onlineContactIds = [2, 3, 4, 6]; // User IDs that are "online"

  const getOnlineContacts = () => {
    if (!users || !friends) return [];
    
    const friendUserIds = friends.map(friend => 
      friend.userId === currentUserId ? friend.friendId : friend.userId
    );
    
    return users
      .filter(user => user.id !== currentUserId && friendUserIds.includes(user.id))
      .map(user => ({
        ...user,
        isOnline: onlineContactIds.includes(user.id)
      }));
  };

  const onlineContacts = getOnlineContacts();

  return (
    <div className="hidden lg:block w-1/4 p-4 pl-2 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide">
      <div className="space-y-4">
        {/* Sponsored */}
        <div>
          <h3 className="text-gray-500 font-semibold mb-3">Sponsored</h3>
          <div className="flex items-center space-x-3 mb-3 cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1625569501924-56704626f870?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" 
              alt="Wireless Earbuds" 
              className="w-28 h-28 rounded-lg object-cover" 
            />
            <div>
              <p className="font-medium text-[#050505]">New Wireless Earbuds</p>
              <p className="text-xs text-[#65676B]">soundgear.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" 
              alt="Luxury Apartments" 
              className="w-28 h-28 rounded-lg object-cover" 
            />
            <div>
              <p className="font-medium text-[#050505]">Luxury Apartments</p>
              <p className="text-xs text-[#65676B]">luxliving.com</p>
            </div>
          </div>
        </div>
        
        {/* Friend Requests */}
        {friendRequests && friendRequests.length > 0 && (
          <div className="border-t border-[#E4E6EB] pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-500 font-semibold">Friend Requests</h3>
              <a href="#" className="text-[#1877F2] text-sm">See All</a>
            </div>
            {friendRequests.map(request => {
              // Find the user who sent the request
              const requestUser = users?.find(user => user.id === request.userId);
              if (!requestUser) return null;
              
              return (
                <div key={request.id} className="bg-white rounded-lg shadow p-3 mb-2">
                  <div className="flex items-start space-x-2">
                    <img 
                      src={requestUser.profilePicture} 
                      alt={requestUser.fullName} 
                      className="w-12 h-12 rounded-full" 
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-[#050505]">{requestUser.fullName}</p>
                      <p className="text-xs text-[#65676B] mb-2">5 mutual friends</p>
                      <div className="flex space-x-2">
                        <button 
                          className="bg-[#1877F2] text-white font-medium px-3 py-1.5 rounded-md w-full"
                          onClick={() => handleFriendRequest(request.id, 'accepted')}
                          disabled={updateFriendRequestMutation.isPending}
                        >
                          Confirm
                        </button>
                        <button 
                          className="bg-gray-200 text-black font-medium px-3 py-1.5 rounded-md w-full"
                          onClick={() => handleFriendRequest(request.id, 'rejected')}
                          disabled={updateFriendRequestMutation.isPending}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Birthdays */}
        <div className="border-t border-[#E4E6EB] pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-500 font-semibold">Birthdays</h3>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-2xl text-[#1877F2]">
              <Gift size={24} />
            </div>
            <p className="text-sm">
              <span className="font-semibold">Emma Davis</span> and <span className="font-semibold">2 others</span> have birthdays today.
            </p>
          </div>
        </div>
        
        {/* Contacts */}
        <div className="border-t border-[#E4E6EB] pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-500 font-semibold">Contacts</h3>
            <div className="flex space-x-2">
              <button className="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center">
                <Video className="text-[#65676B]" size={16} />
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center">
                <Search className="text-[#65676B]" size={16} />
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center">
                <MoreHorizontal className="text-[#65676B]" size={16} />
              </button>
            </div>
          </div>
          
          <div className="space-y-1">
            {onlineContacts.map(contact => (
              <div key={contact.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#F0F2F5] cursor-pointer">
                <div className="relative">
                  <img 
                    src={contact.profilePicture} 
                    alt={contact.fullName} 
                    className="w-8 h-8 rounded-full" 
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 ${contact.isOnline ? 'bg-green-500' : 'bg-gray-400'} rounded-full border-2 border-white`}></div>
                </div>
                <span className="text-[#050505] font-medium">{contact.fullName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
