import SwiftUI
import LucideIcons

struct Navbar: View {
    @Binding var activeTab: String

    private let tabs: [(id: String, label: String, icon: UIImage)] = [
        ("home", "Track", Lucide.droplets),
        ("character", "Character", Lucide.user),
        ("stats", "Stats", Lucide.chartColumn),
        ("achievements", "Awards", Lucide.trophy)
    ]

    var body: some View {
        HStack {
            ForEach(tabs, id: \.id) { tab in
                Button(action: {
                    withAnimation(.spring(response: 0.4, dampingFraction: 0.75)) {
                        activeTab = tab.id
                    }
                }) {
                    VStack(spacing: 4) {
                        Image(uiImage: tab.icon)
                            .renderingMode(.template)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 24, height: 24)
                            .foregroundColor(activeTab == tab.id ? Color.waterPrimary : Color.inactive)

                        Text(tab.label)
                            .font(.caption2)
                            .fontWeight(.medium)
                            .foregroundColor(activeTab == tab.id ? Color.waterPrimary : Color.inactive)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(8)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.appBackground)
        .ignoresSafeArea(edges: .bottom)
        .overlay(
            Rectangle()
            .frame(height: 0.5)
            .foregroundColor(Color.borderLight.opacity(0.2)),
            alignment: .top
        )
    }
}
