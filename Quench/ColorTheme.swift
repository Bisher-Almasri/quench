import SwiftUI

extension Color {
    static let waterPrimary = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#60a5fa") : UIColor(hex: "#3b82f6")
    })
    
    static let waterSecondary = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#22d3ee") : UIColor(hex: "#06b6d4")
    })
    
    static let waterAccent = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#38bdf8") : UIColor(hex: "#0ea5e9")
    })
    
    static let waterLight = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#1e293b") : UIColor(hex: "#dbeafe")
    })
    
    static let waterSurface = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#0f172a") : UIColor(hex: "#f0f9ff")
    })
    
    static let waterGlassBg = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#334155") : UIColor(hex: "#f8fafc")
    })
    
    static let waterGlassBorder = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#475569") : UIColor(hex: "#e2e8f0")
    })
    
    static let waterSuccess = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#34d399") : UIColor(hex: "#10b981")
    })
    
    static let waterWarning = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#fbbf24") : UIColor(hex: "#f59e0b")
    })
    
    static let waterDanger = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#f87171") : UIColor(hex: "#ef4444")
    })
    
    static let waterMuted = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#94a3b8") : UIColor(hex: "#64748b")
    })

    static let mutedForeground = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#a1a1aa") : UIColor(hex: "#717182")
    })
    
    static let headlineForeground = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#e4e4e7") : UIColor(hex: "#3b3b3f")
    })
    
    static let subheadlineForeground = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#a1a1aa") : UIColor(hex: "#9ca3af")
    })
    
    static let pointsBackground = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#27272a") : UIColor(hex: "#eceef2")
    })
    
    static let cardGradientStart = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#27272a") : UIColor(hex: "#EFF6FF")
    })
    
    static let cardGradientEnd = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#18181b") : UIColor(hex: "#F1FDFA")
    })
    
    static let borderLight = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#3f3f46") : UIColor(hex: "#D7DDE5")
    })
    
    static let inactive = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#737373") : UIColor.gray
    })
    
    static let appBackground = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#18181b") : UIColor(hex: "#f9fafb")
    })

    static let foreground = Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(hex: "#f9fafb") : UIColor(hex: "#030213")
    })

}
