// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import ProfileSidebar, { NAV_ITEMS } from "@/app/(WithCommonLayout)/profile/_components/ProfileSidebar";
import ProfileError from "@/app/(WithCommonLayout)/profile/error";
import type { AuthUser } from "@/types/auth";

type MockImageProps = { src?: string; alt?: string; [key: string]: unknown };
type MockLinkProps = { children?: ReactNode; href?: string; [key: string]: unknown };
type MockButtonProps = { children?: ReactNode; [key: string]: unknown };

const mockUser: AuthUser = {
    id: "user-1",
    name: "Student User",
    email: "student@example.com",
    emailVerified: true,
    image: "https://example.com/avatar.jpg",
    role: "learner",
    status: "active",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
};

vi.mock("@/hooks/useAuth", () => ({
    useAuth: () => ({ user: mockUser }),
}));

vi.mock("next/image", () => ({
    default: ({ src, alt, ...props }: MockImageProps) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("next/link", () => ({
    default: ({ children, href, ...props }: MockLinkProps) => (
        <a href={href} {...props}>{children}</a>
    ),
}));

vi.mock("@/components/ui/button", () => ({
    Button: ({ children, ...props }: MockButtonProps) => (
        <button {...props}>{children}</button>
    ),
}));

vi.mock("@/redux/api/uploadApi", () => ({
    useUploadSingleImageMutation: () => [vi.fn(), { isLoading: false }],
}));

vi.mock("@/redux/api/profileApi", () => ({
    useGetUserProfileQuery: () => ({ data: { data: {} }, isLoading: false, refetch: vi.fn() }),
    useUpdateUserProfileMutation: () => [vi.fn()],
}));

vi.mock("@/lib/auth-server-api", () => ({
    authServerApi: { listSessions: vi.fn(), revokeSession: vi.fn() },
}));

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}));

const baseSidebarProps = {
    studentId: "STU-001",
    phone: "+8801XXXXXXXXX",
    profileCompletion: 40,
    fileInputRef: { current: null },
    uploadLoading: false,
    handlePhotoChange: vi.fn(),
    navItems: NAV_ITEMS,
    activeTab: "profile",
    setActiveTab: vi.fn(),
};

describe("ProfileSidebar", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("renders user name, email, student id and phone", () => {
        render(<ProfileSidebar user={mockUser} {...baseSidebarProps} />);
        expect(screen.getByText("Student User")).toBeInTheDocument();
        expect(screen.getByText("student@example.com")).toBeInTheDocument();
        expect(screen.getByText("STU-001")).toBeInTheDocument();
        expect(screen.getByText("+8801XXXXXXXXX")).toBeInTheDocument();
    });

    it("renders profile completion percentage", () => {
        render(<ProfileSidebar user={mockUser} {...baseSidebarProps} />);
        expect(screen.getByText("40%")).toBeInTheDocument();
    });

    it("renders all nav items", () => {
        render(<ProfileSidebar user={mockUser} {...baseSidebarProps} />);
        NAV_ITEMS.forEach((item) => {
            expect(screen.getByText(item.label)).toBeInTheDocument();
        });
    });

    it("has aria-label on the more-info button", () => {
        render(<ProfileSidebar user={mockUser} {...baseSidebarProps} />);
        expect(screen.getByLabelText("More info")).toBeInTheDocument();
    });

    it("has aria-label on the change-photo button", () => {
        render(<ProfileSidebar user={mockUser} {...baseSidebarProps} />);
        expect(screen.getByLabelText("Change profile photo")).toBeInTheDocument();
    });
});

describe("ProfileError", () => {
    it("renders error heading and retry button", () => {
        render(<ProfileError error={new Error("boom")} reset={vi.fn()} />);
        expect(screen.getByText("প্রোফাইল লোড করা যায়নি!")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "আবার চেষ্টা করুন" })).toBeInTheDocument();
    });

    it("renders link to my classes", () => {
        render(<ProfileError error={new Error("boom")} reset={vi.fn()} />);
        expect(screen.getByText("সকল ক্লাসে ফিরে যান")).toBeInTheDocument();
    });
});
