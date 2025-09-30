import { User as UserIcon, LogOut, CheckSquare } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import axios from "axios";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser } from '../store/userSlice';
import { useNavigate } from "react-router-dom";

export function Header() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true });
      dispatch(setUser({ name: "", email: "" }));
      navigate("/login");
    } catch (err) {
      console.error("Erro no logout:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo e navegação */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">TaskFlow</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate("/Home")}>Home</Button>
            <Button variant="outline" onClick={() => navigate("/contacts/register")}>Contact Register</Button>
          </div>
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full hover:bg-accent"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <UserIcon className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "Usuário"}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "email@exemplo.com"}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
