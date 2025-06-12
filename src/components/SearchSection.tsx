import React from 'react';
import { Search, Car, Calendar, MapPin, User, Clock } from 'lucide-react';

interface SearchResult {
  plate: string;
  model: string;
  year: number;
  color: string;
  owner: string;
  status: string;
  location: string;
  entryDate: string;
  lastUpdate: string;
}

export default function SearchSection() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [error, setError] = React.useState('');

  // Mock database of vehicles
  const vehicleDatabase: SearchResult[] = [
    {
      plate: 'ABC-1234',
      model: 'Mercedes-Benz Sprinter',
      year: 2023,
      color: 'Branco',
      owner: 'João Silva',
      status: 'No pátio',
      location: 'Setor A - Vaga 15',
      entryDate: '2024-01-10T14:30:00',
      lastUpdate: '2024-01-15T10:30:00'
    },
    {
      plate: 'DEF-5678',
      model: 'Volkswagen Delivery',
      year: 2022,
      color: 'Azul',
      owner: 'Maria Santos',
      status: 'Em manutenção',
      location: 'Oficina - Box 2',
      entryDate: '2024-01-12T09:15:00',
      lastUpdate: '2024-01-15T09:15:00'
    },
    {
      plate: 'GHI-9012',
      model: 'Ford Transit',
      year: 2023,
      color: 'Prata',
      owner: 'Carlos Oliveira',
      status: 'Reservado',
      location: 'Setor B - Vaga 8',
      entryDate: '2024-01-14T16:20:00',
      lastUpdate: '2024-01-15T11:45:00'
    }
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Por favor, digite uma placa para pesquisar');
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResult(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = vehicleDatabase.find(
      vehicle => vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (result) {
      setSearchResult(result);
    } else {
      setError('Veículo não encontrado em nossa base de dados');
    }

    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'no pátio':
        return 'bg-green-100 text-green-800';
      case 'em manutenção':
        return 'bg-yellow-100 text-yellow-800';
      case 'reservado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Consulta de Placa
          </h2>
          <p className="text-lg text-gray-600">
            Digite a placa do veículo para consultar informações detalhadas
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="plate-search" className="block text-sm font-medium text-gray-700 mb-2">
                Placa do Veículo
              </label>
              <input
                id="plate-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Ex: ABC-1234"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
                maxLength={8}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 h-fit"
              >
                <Search className={`h-5 w-5 ${isSearching ? 'animate-spin' : ''}`} />
                <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Search Result */}
        {searchResult && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-4">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <Car className="h-6 w-6" />
                <span>Informações do Veículo</span>
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Placa:</h4>
                    <span className="text-2xl font-bold font-mono text-blue-600">{searchResult.plate}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Modelo:</span>
                      <span className="font-medium">{searchResult.model}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ano:</span>
                      <span className="font-medium">{searchResult.year}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cor:</span>
                      <span className="font-medium">{searchResult.color}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(searchResult.status)}`}>
                        {searchResult.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location and Dates */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="h-5 w-5" />
                    <div>
                      <span className="text-sm text-gray-600">Proprietário:</span>
                      <p className="font-medium">{searchResult.owner}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <span className="text-sm text-gray-600">Localização:</span>
                      <p className="font-medium">{searchResult.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <span className="text-sm text-gray-600">Data de Entrada:</span>
                      <p className="font-medium">{formatDate(searchResult.entryDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Clock className="h-5 w-5" />
                    <div>
                      <span className="text-sm text-gray-600">Última Atualização:</span>
                      <p className="font-medium">{formatDate(searchResult.lastUpdate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Search Examples */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">Exemplos de placas para teste:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {vehicleDatabase.map((vehicle) => (
              <button
                key={vehicle.plate}
                onClick={() => setSearchTerm(vehicle.plate)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm font-mono transition-colors"
              >
                {vehicle.plate}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}