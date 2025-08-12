//
//  QuenchApp.swift
//  Quench
//
//  Created by Bisher Almasri on 2025-08-11.
//

import SwiftUI
import LucideIcons

struct ContentView: View {
    @State private var activeTab: String = "home"
    @AppStorage("dropletPoints") private var dropletPoints = 0

    var body: some View {
        ZStack(alignment: .bottom) {
            VStack(spacing: 0) {
                contentView()
                    .frame(maxWidth: 400)
                    .padding(.bottom, 80)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
            Navbar(activeTab: $activeTab)
        }
        .background(Color.appBackground)
        .ignoresSafeArea(edges: .bottom)
    }

    @ViewBuilder
    private func contentView() -> some View {
        switch activeTab {
        case "home":
            Track()
        case "character":
            CharacterView()
        case "stats":
            Stats()
        case "achievements":
            Awards()
        default:
            Track()
        }
    }
}


struct CustomTabButton: View {
    var icon: UIImage
    var title: String
    var isSelected: Bool
    var action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Image(uiImage: icon.withRenderingMode(.alwaysTemplate))
                    .renderingMode(.template)
                    .resizable()
                    .foregroundColor(isSelected ? Color.waterPrimary : Color.inactive)
                    .frame(width: 24, height: 24)
                Text(title)
                    .font(.caption)
                    .foregroundColor(isSelected ? Color.waterPrimary : Color.inactive)
            }
            .frame(maxWidth: .infinity)
        }
    }
}

#Preview {
    ContentView()
        .modelContainer(for: Item.self, inMemory: true)
}
