"use client";

import {useState, useEffect} from "react";
import {useSession, signIn} from "next-auth/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faEdit} from "@fortawesome/free-solid-svg-icons";
import "@/styles/comment-section.css";
import Image from "next/image"; // Ensure this file contains your custom styles

interface CommentType {
    id: string;
    parentId?: string | null;
    content: string;
    rating: number;
    createdAt: string;
    user: { name: string; image: string };
    replies: CommentType[];
}

export default function CommentSection({placeId}: { placeId: string }) {
    const {data: session} = useSession();
    const user = session?.user;

    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(0);

    useEffect(() => {
        load();
    }, [placeId]);

    const load = async () => {
        const res = await fetch(`/api/reviews?placeId=${placeId}`);
        if (!res.ok) return;
        const flat = await res.json();
        setComments(nest(flat));
    };

    const nest = (flat: CommentType[]): CommentType[] => {
        const map = new Map(flat.map(c => [c.id, {...c, replies: []}]));
        const roots: CommentType[] = [];
        map.forEach(c => {
            if (c.parentId && map.has(c.parentId)) {
                map.get(c.parentId)!.replies.push(c);
            } else roots.push(c);
        });
        return roots;
    };

    const requireLogin = async () => {
        if (!user?.id) await signIn();
        return !!user?.id;
    };

    const post = async (parentId: string | null, content: string, rating: number) => {
        if (!(await requireLogin())) return;
        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({placeId, content, rating, parentId}),
        });
        if (res.ok) {
            setNewComment(""); // Clear the textarea
            setNewRating(0); // Reset the rating to 0
            load(); // Reload comments
        }
    };

    const remove = async (id: string) => {
        if (!(await requireLogin())) return;
        await fetch(`/api/reviews/${id}`, {method: "DELETE"});
        load();
    };

    const update = async (id: string, content: string) => {
        if (!(await requireLogin())) return;
        await fetch(`/api/reviews/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({content}),
        });
        load();
    };

    const Comment = ({comment}: { comment: CommentType }) => {
        const isOwn = user?.name === comment.user.name;

        const [editOpen, setEditOpen] = useState(false);
        const [content, setContent] = useState(comment.content);

        return (
            <div className="bg-white p-4 rounded-lg shadow-md mb-4  w-full max-w-[935px]">
                <div className="flex items-center space-x-3">
                    <Image
                        height={26}
                        width={26}
                        src={comment.user.image}
                        alt={comment.user.name}
                        className="rounded-full"
                    />
                    <div>
                        <div className="font-semibold text-gray-800">{comment.user.name}</div>
                        <div className="text-sm text-gray-500">{comment.createdAt}</div>
                    </div>
                </div>
                {editOpen ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                    />
                ) : (
                    <p className="mt-2 text-gray-700">{comment.content}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">Rating: {comment.rating} ⭐</span>
                    <div className="space-x-2">

                        {isOwn && (
                            <>


                                <button
                                    onClick={() => remove(comment.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
                            </>
                        )}
                    </div>
                </div>


            </div>
        );
    };

    return (

        <div className="z-10 w-full max-w-[935px] h-[70vh] flex flex-col bg-white p-4 rounded-lg shadow-md mt-6 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
            </div>
            <div className="mt-6">
        <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a review..."
            className="w-full p-3 border border-gray-300 rounded-md mb-2"
        />
                <div className="flex items-center space-x-2">
                    <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded-md"
                    >
                        <option value={0}>Rating</option>
                        {[1, 2, 3, 4, 5].map((r) => (
                            <option key={r} value={r}>
                                {r} ⭐
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => post(null, newComment, newRating)}
                        className="bu-primary bg-blue-500 text-white font-medium text-sm px-4 py-2 rounded hover:bg-blue-600 ml-auto"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}
