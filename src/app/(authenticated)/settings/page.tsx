import { Separator } from '@/components/ui/separator'
import { ProfileForm } from '@/app/(authenticated)/settings/profile-form'

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Details here will be used in some parts of the application eg. recipt.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}
