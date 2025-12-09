"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type React from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type PermitStatus, PermitType } from "@/db";
import { useApi } from "@/hooks/useApi";
import { getStatusBadge } from "@/utils/mapping";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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

export interface PermitHistoryTableRef {
  refresh: () => void;
}

const PermitHistoryTable = forwardRef<PermitHistoryTableRef, React.ComponentPropsWithoutRef<"div">>(
  (_, ref) => {
    const { data: permits, loading, error, callApi } = useApi<UserPermit[]>();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const refreshPermits = useCallback(() => {
      callApi("/api/permit/fetch-user-permits");
    }, [callApi]);

    useImperativeHandle(
      ref,
      () => ({
        refresh: refreshPermits,
      }),
      [refreshPermits]
    );

    useEffect(() => {
      refreshPermits();
    }, [refreshPermits]);

    if (loading) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div>Loading...</div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-red-500">Error: {error}</div>
          </CardContent>
        </Card>
      );
    }

    // Calcola la paginazione
    const totalItems = permits?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = permits?.slice(startIndex, endIndex) || [];

    // Funzioni per la navigazione
    const goToFirstPage = () => setCurrentPage(1);
    const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
    const goToNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));
    const goToLastPage = () => setCurrentPage(totalPages);

    // Gestisce il cambio di elementi per pagina
    const handleItemsPerPageChange = (value: string) => {
      setItemsPerPage(Number(value));
      setCurrentPage(1); // Reset alla prima pagina
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

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Storico Richieste</CardTitle>
                <CardDescription>Le tue richieste di ferie e permessi</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Righe per pagina:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20">
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
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ore</TableHead>
                    <TableHead>Motivazione</TableHead>
                    <TableHead>Responsabile</TableHead>
                    <TableHead>Stato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Nessuna richiesta trovata
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((permit, index) => (
                      <TableRow key={index}>
                        <TableCell>{getTypeLabel(permit.type)}</TableCell>
                        <TableCell>{new Date(permit.date).toLocaleDateString()} </TableCell>
                        <TableCell>{Number(permit.duration)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {permit.description}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {permit.user_permit_reviewer_idTouser.name}
                        </TableCell>
                        <TableCell>{getStatusBadge(permit.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Controlli di paginazione */}
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
                    className="h-8 w-8 bg-transparent"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 bg-transparent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
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
                          className="h-8 w-8"
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
                    className="h-8 w-8 bg-transparent"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 bg-transparent"
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
);

PermitHistoryTable.displayName = "PermitHistoryTable";

export default PermitHistoryTable;
