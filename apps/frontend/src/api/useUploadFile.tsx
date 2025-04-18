import { SERVERL_BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";

export function useUploadFile() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const uploadFile = ({ file }: { file: FormData }) => {
    setIsLoading(true);
    return fetch(`${SERVERL_BASE_URL}/user/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: file,
    })
      .then((res) => res.json())
      .then((data) => data)
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { uploadFile, isLoading };
}
