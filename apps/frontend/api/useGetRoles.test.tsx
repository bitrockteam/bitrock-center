import { renderHook, waitFor } from "@testing-library/react";
import { useGetRoles } from "./useGetRoles";

const mockRoles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "User" },
];

function mockFetch(data: any) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => data,
    }),
  );
}

describe("useGetRoles", () => {
  const originalFetch = global.fetch;
  beforeAll(() => {
    global.fetch = mockFetch(mockRoles);
  });
  afterAll(() => {
    global.fetch = originalFetch;
  });

  test("should fetch roles and set them in the state", async () => {
    const { result } = renderHook(() => useGetRoles());

    expect(result.current.roles).toEqual([]);
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.roles).toEqual(mockRoles);
    });
  });
});
