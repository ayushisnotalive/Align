import io.github.jan.supabase.auth.OtpType
println(OtpType.Email::class.sealedSubclasses.map { it.simpleName })
