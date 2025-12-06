import { useNavigate } from "react-router"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/common/button"
import { RootContainer } from "@/components/layouts/root-container"

const ForbiddenPage = () => {
  const navigate = useNavigate()

  return (
    <RootContainer classNames="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <ShieldAlert className="w-20 h-20 text-destructive opacity-80" />
        <h1 className="text-4xl font-bold tracking-tight">403</h1>
        <h2 className="text-xl font-semibold text-muted-foreground">Доступ заборонено</h2>
      </div>

      <p className="max-w-[500px] text-muted-foreground">
        У вас немає прав для перегляду цієї сторінки. Якщо ви вважаєте, що це помилка, зверніться до адміністратора або
        спробуйте увійти з іншого акаунту.
      </p>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Назад
        </Button>
        <Button onClick={() => navigate("/")}>На головну</Button>
      </div>
    </RootContainer>
  )
}

export default ForbiddenPage
