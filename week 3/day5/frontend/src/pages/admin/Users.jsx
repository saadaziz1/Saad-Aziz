import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '../../api/users';
import { adminAPI } from '../../api/admin';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Users as UsersIcon, Shield, ShieldCheck, UserX, UserCheck } from 'lucide-react';

const Users = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => usersAPI.list({ page, limit: 10 }).then(res => res.data),
  });

  const blockMutation = useMutation({
    mutationFn: (id) => usersAPI.block(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const unblockMutation = useMutation({
    mutationFn: (id) => usersAPI.unblock(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const promoteToAdminMutation = useMutation({
    mutationFn: (id) => adminAPI.promoteToAdmin(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const promoteToSuperadminMutation = useMutation({
    mutationFn: (id) => adminAPI.promoteToSuperadmin(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const demoteMutation = useMutation({
    mutationFn: (id) => adminAPI.demoteToUser(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const handleBlock = async (id) => {
    await blockMutation.mutateAsync(id);
  };

  const handleUnblock = async (id) => {
    await unblockMutation.mutateAsync(id);
  };

  const handlePromote = async (id, role) => {
    if (role === 'admin') {
      await promoteToAdminMutation.mutateAsync(id);
    } else if (role === 'superadmin') {
      await promoteToSuperadminMutation.mutateAsync(id);
    }
  };

  const handleDemote = async (id) => {
    await demoteMutation.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
        <p className="text-destructive">Error loading users</p>
      </div>
    );
  }

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);
  const currentPage = page;

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'superadmin': return 'default';
      case 'admin': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'superadmin': return <ShieldCheck className="h-3 w-3" />;
      case 'admin': return <Shield className="h-3 w-3" />;
      default: return <UsersIcon className="h-3 w-3" />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-background overflow-x-hidden max-w-screen">
      <div className="max-w-400 mx-auto p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage user accounts and permissions</p>
        </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Users ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6">
            <div className="px-6 min-w-[700px]">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%] min-w-[120px]">User</TableHead>
                  <TableHead className="hidden md:table-cell w-[25%] min-w-[150px]">Email</TableHead>
                  <TableHead className="w-[15%] min-w-[80px]">Role</TableHead>
                  <TableHead className="w-[15%] min-w-[80px]">Status</TableHead>
                  <TableHead className="w-[20%] min-w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <UsersIcon className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[120px]">{user.name}</p>
                          <p className="text-sm text-muted-foreground md:hidden truncate max-w-[120px]">
                            {user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm truncate max-w-[150px] block">{user.email}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                          {getRoleIcon(user.role)}
                          <span className="ml-1">{user.role}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isBlocked ? 'destructive' : 'success'}>
                          {user.isBlocked ? (
                            <><UserX className="h-3 w-3 mr-1" />Blocked</>
                          ) : (
                            <><UserCheck className="h-3 w-3 mr-1" />Active</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.isBlocked ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnblock(user._id)}
                              disabled={unblockMutation.isPending}
                            >
                              <UserCheck className="h-3 w-3" />
                              <span className="hidden sm:inline ml-1">Unblock</span>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleBlock(user._id)}
                              disabled={blockMutation.isPending}
                            >
                              <UserX className="h-3 w-3" />
                              <span className="hidden sm:inline ml-1">Block</span>
                            </Button>
                          )}
                          
                          {user.role === 'user' && (
                            <>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handlePromote(user._id, 'admin')}
                                disabled={promoteToAdminMutation.isPending}
                              >
                                <Shield className="h-3 w-3" />
                                <span className="hidden lg:inline ml-1">Admin</span>
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handlePromote(user._id, 'superadmin')}
                                disabled={promoteToSuperadminMutation.isPending}
                              >
                                <ShieldCheck className="h-3 w-3" />
                                <span className="hidden lg:inline ml-1">Super</span>
                              </Button>
                            </>
                          )}
                          
                          {user.role === 'admin' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDemote(user._id)}
                                disabled={demoteMutation.isPending}
                              >
                                <UsersIcon className="h-3 w-3" />
                                <span className="hidden lg:inline ml-1">Demote</span>
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handlePromote(user._id, 'superadmin')}
                                disabled={promoteToSuperadminMutation.isPending}
                              >
                                <ShieldCheck className="h-3 w-3" />
                                <span className="hidden lg:inline ml-1">Super</span>
                              </Button>
                            </>
                          )}
                          
                          {user.role === 'superadmin' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDemote(user._id)}
                              disabled={demoteMutation.isPending}
                            >
                              <UsersIcon className="h-3 w-3" />
                              <span className="hidden lg:inline ml-1">Demote</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;

