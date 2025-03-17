
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUsers, isAdmin, logoutUser } from "@/services/userService";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const users = getUsers();
  
  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin()) {
      toast.error("You don't have permission to access this page");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">ID</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Age</th>
                    <th className="border p-2 text-left">Mobile</th>
                    <th className="border p-2 text-left">Signup Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border p-2">{user.id}</td>
                        <td className="border p-2">{`${user.firstName} ${user.lastName}`}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">{user.age}</td>
                        <td className="border p-2">{user.mobile}</td>
                        <td className="border p-2">{new Date(user.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="border p-2 text-center">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
