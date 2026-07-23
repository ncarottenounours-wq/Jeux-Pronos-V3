import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({

  plugins: [

    react(),

    VitePWA({

      registerType: 'autoUpdate',

      manifest: {

        name: "Tournoi",

        short_name: "Tournoi",

        description: "Application de tournoi",

        theme_color: "#000000",

        icons: []

      }

    })

  ],

})