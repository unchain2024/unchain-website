import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/lib/language";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import NewsPage from "./pages/NewsPage";
import CareerPage from "./pages/CareerPage";
import ContactPage from "./pages/ContactPage";
import SolutionsPage from "./pages/SolutionsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfUsePage from "./pages/TermsOfUsePage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import PublishNewsPage from "./pages/PublishNewsPage";
import EditNewsListPage from "./pages/EditNewsListPage";
import EditNewsPage from "./pages/EditNewsPage";
import BlogRedirect from "./pages/BlogRedirect";
import PublishBlogPage from "./pages/PublishBlogPage";
import EditBlogListPage from "./pages/EditBlogListPage";
import EditBlogPage from "./pages/EditBlogPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

const queryClient = new QueryClient();

const AppLayout = () => (
  <LanguageProvider>
    <ScrollToTop />
    <Outlet />
  </LanguageProvider>
);

const pageRoutes = (
  <>
    <Route index element={<Index />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="news" element={<NewsPage />} />
    <Route path="news/:slug" element={<NewsPage />} />
    {/* Blogs live in the news section now; these keep the old URLs working. */}
    <Route path="blog" element={<BlogRedirect />} />
    <Route path="blog/:slug" element={<BlogRedirect />} />
    <Route path="career" element={<CareerPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="solutions" element={<SolutionsPage />} />
    <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
    <Route path="terms-of-use" element={<TermsOfUsePage />} />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          {/* Japanese (default) */}
          <Route element={<AppLayout />}>
            {pageRoutes}
          </Route>

          {/* English */}
          <Route path="/en" element={<AppLayout />}>
            {pageRoutes}
            <Route path="login" element={<Login />} />
            <Route path="publish" element={<PublishNewsPage />} />
            <Route path="edit" element={<EditNewsListPage />} />
            <Route path="edit/:id" element={<EditNewsPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="publish-blog" element={<PublishBlogPage />} />
            <Route path="edit-blog" element={<EditBlogListPage />} />
            <Route path="edit-blog/:id" element={<EditBlogPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AppLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="publish" element={<PublishNewsPage />} />
            <Route path="edit" element={<EditNewsListPage />} />
            <Route path="edit/:id" element={<EditNewsPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="publish-blog" element={<PublishBlogPage />} />
            <Route path="edit-blog" element={<EditBlogListPage />} />
            <Route path="edit-blog/:id" element={<EditBlogPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<AppLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
