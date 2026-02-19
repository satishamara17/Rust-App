import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNoteFn } from "../../api/noteApi";
import NProgress from "nprogress";

type ICreateNoteProps = {
  setOpenNoteModal: (open: boolean) => void;
};

const createNoteSchema = object({
  title: string().min(1, "Title is required"),
  content: string().min(1, "Content is required"),
});

export type CreateNoteInput = TypeOf<typeof createNoteSchema>;

const CreateNote: FC<ICreateNoteProps> = ({ setOpenNoteModal }) => {
  const methods = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const queryClient = useQueryClient();

  const { mutate: createNote } = useMutation({
    mutationFn: (note: CreateNoteInput) => createNoteFn(note),
    onMutate() {
      NProgress.start();
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["getNotes"]);
      setOpenNoteModal(false);
      NProgress.done();
      toast("Note created successfully", {
        type: "success",
        position: "top-right",
      });
    },
    onError(error: any) {
      setOpenNoteModal(false);
      NProgress.done();
      const resMessage =
        error.response.data.message ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast(resMessage, {
        type: "error",
        position: "top-right",
      });
    },
  });

  const onSubmitHandler: SubmitHandler<CreateNoteInput> = async (data) => {
    createNote(data);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-glass-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(168, 85, 247, 0.15)' }}
          >
            <i className="bx bx-plus text-ct-blue-600 text-lg"></i>
          </div>
          <h2 className="text-xl text-white font-semibold">Create Note</h2>
        </div>
        <div
          onClick={() => setOpenNoteModal(false)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b6b85] hover:text-white hover:bg-glass-bg cursor-pointer transition-all duration-200"
        >
          <i className="bx bx-x text-xl"></i>
        </div>
      </div>
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#a0a0b8] mb-2" htmlFor="title">
            Title
          </label>
          <input
            className={twMerge(
              `appearance-none border border-glass-border rounded-xl w-full py-3 px-4 text-white text-sm bg-[rgba(255,255,255,0.03)] leading-tight focus:outline-none focus:border-ct-blue-600 focus:ring-1 focus:ring-ct-blue-600 transition-all duration-200 placeholder-[#4a4a60]`,
              `${errors["title"] && "border-red-500 focus:border-red-500 focus:ring-red-500"}`
            )}
            placeholder="Enter note title..."
            {...methods.register("title")}
          />
          <p
            className={twMerge(
              `text-red-400 text-xs mt-1.5 invisible`,
              `${errors["title"] && "visible"}`
            )}
          >
            {errors["title"]?.message as string}
          </p>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-[#a0a0b8] mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            className={twMerge(
              `appearance-none border border-glass-border rounded-xl w-full py-3 px-4 text-white text-sm bg-[rgba(255,255,255,0.03)] leading-relaxed focus:outline-none focus:border-ct-blue-600 focus:ring-1 focus:ring-ct-blue-600 transition-all duration-200 resize-none placeholder-[#4a4a60]`,
              `${errors.content && "border-red-500 focus:border-red-500 focus:ring-red-500"}`
            )}
            rows={6}
            placeholder="Write your note content..."
            {...register("content")}
          />
          <p
            className={twMerge(
              `text-red-400 text-xs mt-1.5`,
              `${errors.content ? "visible" : "invisible"}`
            )}
          >
            {errors.content && errors.content.message}
          </p>
        </div>
        <LoadingButton loading={false}>Create Note</LoadingButton>
      </form>
    </section>
  );
};

export default CreateNote;
