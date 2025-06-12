import React from 'react';
import { Car, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">FozTrans</span>
            </div>
            <p className="text-gray-300 mb-4">
              Soluções completas em transporte e logística com qualidade, segurança e pontualidade há mais de 15 anos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Transporte de Cargas</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Logística Integrada</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Armazenamento</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Distribuição</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Rastreamento 24h</a></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">(45) 2105-9600</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">foztrans@pmfi.pr.gov.br</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-blue-400 mt-1" />
                <div className="text-gray-300">
                  <p>Rua Edgard Schimmelpfeng, 43 Centro Cívico</p>
                  <p>Foz do Iguaçu - PR</p>
                  <p>CEP 85863-900</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} FozTrans. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}