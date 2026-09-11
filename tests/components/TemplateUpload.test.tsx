import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TemplateUpload } from "@/components/gallery/TemplateUpload";

// jsdom has no createObjectURL (used for the image preview).
beforeEach(() => {
  Object.defineProperty(URL, "createObjectURL", {
    writable: true,
    value: vi.fn(() => "blob:preview"),
  });
  Object.defineProperty(URL, "revokeObjectURL", { writable: true, value: vi.fn() });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** The upload request the dialog made, as a FormData instance. */
type FetchMock = ReturnType<
  typeof vi.fn<(url: string, init?: RequestInit) => Promise<Response>>
>;

function bodyOf(fetchMock: FetchMock): FormData {
  const [, init] = fetchMock.mock.calls[0];
  return init?.body as FormData;
}

describe("TemplateUpload", () => {
  it("uploads the values typed after the image was selected", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(
      async (_url: string, _init?: RequestInit) =>
        new Response(JSON.stringify({ success: true, data: { id: "doc-1" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<TemplateUpload isOpen onOpenChange={() => {}} prefillPrompt="a prompt" />);

    // 1. Pick the image first — this is what used to freeze the form state.
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(["png"], "gajah.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // 2. Fill the form afterwards.
    await user.type(screen.getByLabelText("Judul Template"), "Gajah");
    await user.type(screen.getByLabelText("Deskripsi"), "style animasi");
    await user.type(
      screen.getByLabelText("Dihasilkan dengan"),
      "Playground v2.5"
    );

    await user.click(screen.getByRole("button", { name: /Upload Template/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock.mock.calls[0][0]).toBe("/api/templates/upload");

    const body = bodyOf(fetchMock);
    expect(body.get("title")).toBe("Gajah");
    expect(body.get("description")).toBe("style animasi");
    expect(body.get("original_prompt")).toBe("a prompt");
    expect(body.get("original_image_generated_with")).toBe("Playground v2.5");
    expect(body.get("image")).toBe(file);
    expect(screen.queryByText("Judul template wajib diisi")).toBeNull();
  });

  it("reports the server's message when the upload fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async (_url: string, _init?: RequestInit) =>
          new Response(
            JSON.stringify({ success: false, error: "Gambar gagal disimpan" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          )
      )
    );

    render(<TemplateUpload isOpen onOpenChange={() => {}} prefillPrompt="a prompt" />);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fireEvent.change(fileInput, {
      target: { files: [new File(["png"], "gajah.png", { type: "image/png" })] },
    });

    await user.type(screen.getByLabelText("Judul Template"), "Gajah");
    await user.type(screen.getByLabelText("Deskripsi"), "style animasi");
    await user.type(screen.getByLabelText("Dihasilkan dengan"), "FLUX");
    await user.click(screen.getByRole("button", { name: /Upload Template/i }));

    expect(await screen.findByText("Gambar gagal disimpan")).toBeTruthy();
  });
});
