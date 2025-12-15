"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermitStatus, PermitType } from "@/db";
import { useApi } from "@/hooks/useApi";
import { getStatusBadge } from "@/utils/mapping";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type UserPermit = {
  id: string;
  type: PermitType;
  date: Date;
  duration: number;
  description: string | null;
  status: PermitStatus;
  user_permit_reviewer_idTouser: {
    id: string;
    name: string;
  };
};

type PermitByReviewer = {
  id: string;
  type: PermitType;
  date: Date;
  duration: number;
  description: string | null;
  status: PermitStatus;
  user_permit_user_idTouser: {
    id: string;
    name: string;
  };
};

type UnifiedPermit = {
  id: string;
  type: PermitType;
  date: Date;
  duration: number;
  description: string | null;
  status: PermitStatus;
  reviewer?: { id: string; name: string };
  requester?: { id: string; name: string };
  isReviewer: boolean;
  timeStatus: "past" | "current" | "future";
};

interface UnifiedPermitsTableProps {
  canApprovePermit?: boolean;
}

export default function UnifiedPermitsTable({
  canApprovePermit = false,
}: UnifiedPermitsTableProps) {
  const {
    data: userPermits,
    loading: userPermitsLoading,
    callApi: fetchUserPermits,
  } = useApi<UserPermit[]>();
  const {
    data: reviewerPermits,
    loading: reviewerPermitsLoading,
    callApi: fetchReviewerPermits,
  } = useApi<PermitByReviewer[]>();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [timeStatusFilter, setTimeStatusFilter] = useState<string>("all");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch data
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to fetch data when canApprovePermit changes
  useEffect(() => {
    fetchUserPermits("/api/permit/fetch-user-permits");
    if (canApprovePermit) {
      fetchReviewerPermits("/api/permit/get-permits-by-reviewer");
    }
  }, [canApprovePermit]);

  const refreshData = () => {
    fetchUserPermits("/api/permit/fetch-user-permits");
    if (canApprovePermit) {
      fetchReviewerPermits("/api/permit/get-permits-by-reviewer");
    }
  };

  // Compute time status based on date
  const getTimeStatus = useMemo(
    () =>
      (date: Date): "past" | "current" | "future" => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const permitDate = new Date(date);
        permitDate.setHours(0, 0, 0, 0);

        if (permitDate < today) return "past";
        if (permitDate.getTime() === today.getTime()) return "current";
        return "future";
      },
    []
  );

  // Merge and transform permits
  const unifiedPermits = useMemo<UnifiedPermit[]>(() => {
    const permits: UnifiedPermit[] = [];

    // Add user permits
    if (userPermits) {
      userPermits.forEach((permit) => {
        permits.push({
          id: permit.id,
          type: permit.type,
          date: new Date(permit.date),
          duration: permit.duration,
          description: permit.description,
          status: permit.status,
          reviewer: permit.user_permit_reviewer_idTouser,
          isReviewer: false,
          timeStatus: getTimeStatus(new Date(permit.date)) as "past" | "current" | "future",
        });
      });
    }

    // Add reviewer permits (only if user can approve)
    if (canApprovePermit && reviewerPermits) {
      reviewerPermits.forEach((permit) => {
        permits.push({
          id: permit.id,
          type: permit.type,
          date: new Date(permit.date),
          duration: permit.duration,
          description: permit.description,
          status: permit.status,
          requester: permit.user_permit_user_idTouser,
          reviewer: undefined, // Reviewer is the current user (the one viewing)
          isReviewer: true,
          timeStatus: getTimeStatus(new Date(permit.date)) as "past" | "current" | "future",
        });
      });
    }

    // Sort by date descending
    return permits.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [userPermits, reviewerPermits, canApprovePermit, getTimeStatus]);

  // Filter permits
  const filteredPermits = useMemo(() => {
    return unifiedPermits.filter((permit) => {
      // Type filter
      if (typeFilter !== "all" && permit.type !== typeFilter) return false;

      // Status filter
      if (statusFilter !== "all" && permit.status !== statusFilter) return false;

      // Time status filter
      if (timeStatusFilter !== "all" && permit.timeStatus !== timeStatusFilter) return false;

      // Date range filter
      if (dateFromFilter) {
        const fromDate = new Date(dateFromFilter);
        fromDate.setHours(0, 0, 0, 0);
        if (permit.date < fromDate) return false;
      }
      if (dateToFilter) {
        const toDate = new Date(dateToFilter);
        toDate.setHours(23, 59, 59, 999);
        if (permit.date > toDate) return false;
      }

      // Text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesDescription = permit.description?.toLowerCase().includes(query);
        const matchesReviewer = permit.reviewer?.name.toLowerCase().includes(query);
        const matchesRequester = permit.requester?.name.toLowerCase().includes(query);
        if (!matchesDescription && !matchesReviewer && !matchesRequester) return false;
      }

      return true;
    });
  }, [
    unifiedPermits,
    typeFilter,
    statusFilter,
    timeStatusFilter,
    dateFromFilter,
    dateToFilter,
    searchQuery,
  ]);

  // Pagination
  const totalItems = filteredPermits.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredPermits.slice(startIndex, endIndex);

  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const goToNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));
  const goToLastPage = () => setCurrentPage(totalPages);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case PermitType.VACATION:
        return "Ferie";
      case PermitType.PERMISSION:
        return "Permesso";
      case PermitType.SICKNESS:
        return "Malattia";
      default:
        return type;
    }
  };

  const getTimeStatusLabel = (status: "past" | "current" | "future") => {
    switch (status) {
      case "past":
        return "Passato";
      case "current":
        return "In Corso";
      case "future":
        return "Futuro";
    }
  };

  const getTimeStatusBadge = (status: "past" | "current" | "future") => {
    switch (status) {
      case "past":
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-600 dark:text-gray-400">
            Passato
          </Badge>
        );
      case "current":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
            In Corso
          </Badge>
        );
      case "future":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
            Futuro
          </Badge>
        );
    }
  };

  const { callApi: updatePermitStatus } = useApi();

  const approvePermit = async (permitId: string) => {
    try {
      await updatePermitStatus("/api/permit/update-permit-status", {
        method: "PUT",
        body: JSON.stringify({ permitId, status: PermitStatus.APPROVED }),
      });
      toast.success("Permesso approvato");
      refreshData();
    } catch {
      toast.error("Errore nell'approvazione del permesso");
    }
  };

  const rejectPermit = async (permitId: string) => {
    try {
      await updatePermitStatus("/api/permit/update-permit-status", {
        method: "PUT",
        body: JSON.stringify({ permitId, status: PermitStatus.REJECTED }),
      });
      toast.success("Permesso rigettato");
      refreshData();
    } catch {
      toast.error("Errore nel rigetto del permesso");
    }
  };

  const clearFilters = () => {
    setTypeFilter("all");
    setStatusFilter("all");
    setTimeStatusFilter("all");
    setDateFromFilter("");
    setDateToFilter("");
    setSearchQuery("");
  };

  const hasActiveFilters =
    typeFilter !== "all" ||
    statusFilter !== "all" ||
    timeStatusFilter !== "all" ||
    dateFromFilter !== "" ||
    dateToFilter !== "" ||
    searchQuery !== "";

  const loading = userPermitsLoading || reviewerPermitsLoading;

  if (loading) {
    return (
      <Card className="group relative overflow-hidden border-2 transition-all duration-300">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Caricamento...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="relative">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Richieste Ferie e Permessi</CardTitle>
              <CardDescription>
                {filteredPermits.length} di {unifiedPermits.length} richieste
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Righe per pagina:</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20 transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cerca per motivazione, responsabile o richiedente..."
                className="pl-8 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] transition-all duration-300">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i tipi</SelectItem>
                  <SelectItem value={PermitType.VACATION}>Ferie</SelectItem>
                  <SelectItem value={PermitType.PERMISSION}>Permesso</SelectItem>
                  <SelectItem value={PermitType.SICKNESS}>Malattia</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] transition-all duration-300">
                  <SelectValue placeholder="Stato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti gli stati</SelectItem>
                  <SelectItem value={PermitStatus.PENDING}>In Attesa</SelectItem>
                  <SelectItem value={PermitStatus.APPROVED}>Approvato</SelectItem>
                  <SelectItem value={PermitStatus.REJECTED}>Rifiutato</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeStatusFilter} onValueChange={setTimeStatusFilter}>
                <SelectTrigger className="w-[140px] transition-all duration-300">
                  <SelectValue placeholder="Periodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i periodi</SelectItem>
                  <SelectItem value="past">Passato</SelectItem>
                  <SelectItem value="current">In Corso</SelectItem>
                  <SelectItem value="future">Futuro</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Input
                  type="date"
                  placeholder="Da"
                  className="w-[140px] transition-all duration-300"
                  value={dateFromFilter}
                  onChange={(e) => {
                    setDateFromFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Input
                  type="date"
                  placeholder="A"
                  className="w-[140px] transition-all duration-300"
                  value={dateToFilter}
                  onChange={(e) => {
                    setDateToFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="transition-all duration-300 hover:scale-105"
                >
                  <X className="mr-2 h-4 w-4" />
                  Pulisci
                </Button>
              )}
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {typeFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    Tipo: {getTypeLabel(typeFilter)}
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    Stato: {statusFilter}
                  </Badge>
                )}
                {timeStatusFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    Periodo: {getTimeStatusLabel(timeStatusFilter as "past" | "current" | "future")}
                  </Badge>
                )}
                {dateFromFilter && (
                  <Badge variant="secondary" className="text-xs">
                    Da: {new Date(dateFromFilter).toLocaleDateString()}
                  </Badge>
                )}
                {dateToFilter && (
                  <Badge variant="secondary" className="text-xs">
                    A: {new Date(dateToFilter).toLocaleDateString()}
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    Cerca: {searchQuery}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ore</TableHead>
                  <TableHead>Motivazione</TableHead>
                  {canApprovePermit && <TableHead>Richiedente</TableHead>}
                  <TableHead>Responsabile</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Periodo</TableHead>
                  {canApprovePermit && <TableHead className="text-right">Azioni</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={canApprovePermit ? 9 : 7}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Nessuna richiesta trovata
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((permit, index) => (
                    <motion.tr
                      key={permit.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="group/row transition-all duration-300 hover:bg-muted/50 border-b"
                    >
                      <TableCell className="group-hover/row:text-primary transition-colors">
                        {getTypeLabel(permit.type)}
                      </TableCell>
                      <TableCell className="group-hover/row:text-primary transition-colors">
                        {permit.date.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="group-hover/row:text-primary transition-colors font-medium">
                        {Number(permit.duration)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate group-hover/row:text-primary transition-colors">
                        {permit.description || "-"}
                      </TableCell>
                      {canApprovePermit && (
                        <TableCell className="group-hover/row:text-primary transition-colors">
                          {permit.isReviewer ? permit.requester?.name || "-" : "-"}
                        </TableCell>
                      )}
                      <TableCell className="group-hover/row:text-primary transition-colors">
                        {permit.reviewer?.name || "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(permit.status)}</TableCell>
                      <TableCell>{getTimeStatusBadge(permit.timeStatus)}</TableCell>
                      {canApprovePermit &&
                        permit.isReviewer &&
                        permit.status === PermitStatus.PENDING && (
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                size="sm"
                                onClick={() => approvePermit(permit.id)}
                                className="transition-all duration-300 hover:scale-105"
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Approva
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectPermit(permit.id)}
                                className="transition-all duration-300 hover:scale-105"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Respingi
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      {canApprovePermit &&
                        (!permit.isReviewer || permit.status !== PermitStatus.PENDING) && (
                          <TableCell className="text-right">-</TableCell>
                        )}
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} - {Math.min(endIndex, totalItems)} di {totalItems}{" "}
                richieste
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 transition-all duration-300 hover:scale-110"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber: number;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="icon"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="h-8 w-8 transition-all duration-300 hover:scale-110"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 transition-all duration-300 hover:scale-110"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
