import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Car, Calendar, MapPin, Info } from 'lucide-react';

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  year: number;
  color: string;
  status: 'No patio' | 'Disponível para Leilão';
  location: string;
  lastUpdate: string;
  fullDetails: Record<string, any>;
}

export default function PatioSection() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchExcel = async () => {
      const url =import.meta.env.VITE_LINK_DRIVE;

      const res = await fetch(url);
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<any>(sheet);

      const parsed: Vehicle[] = data.map((row: any, i: number) => ({
        id: row['N.º TRV']?.toString() || `${i}`,
        plate: row['Placa'] || 'SEM-PLACA',
        model: `${row['Marca'] || ''} ${row['Modelo'] || ''}`.trim(),
        year: row['Ano'] || 'Não informado',
        color: row['Cor'] || 'Não informado',
        status: 'No patio',
        location: row['Local da Apreensão'] || 'Local desconhecido',
        lastUpdate: (() => {
          const rawDate = row['Data da Remoção'];
          if (typeof rawDate === 'number') {
            const dateObj = XLSX.SSF.parse_date_code(rawDate);
            return new Date(dateObj.y, dateObj.m - 1, dateObj.d).toISOString();
          }
          if (typeof rawDate === 'string') {
            const parsed = new Date(rawDate);
            return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
          }
          return new Date().toISOString();
        })(),
        fullDetails: row,
      }));
        const agora = new Date();
        const atualizados = parsed.map((v) => {
        const dataRemocao = new Date(v.lastUpdate);
        const diasPassados = (agora.getTime() - dataRemocao.getTime()) / (1000 * 60 * 60 * 24);

        if (diasPassados > 60) {
          return { ...v, status: 'Disponível para Leilão' as 'Disponível para Leilão' };
        }

        return { ...v, status: 'No patio' as 'No patio' };
      });
      setVehicles(atualizados);
    };

    fetchExcel();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'No patio':
        return 'bg-green-100 text-green-800';
      case 'Disponível para Leilão':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'No patio':
        return 'No pátio';
      case 'Disponível para Leilão':
        return 'Disponível para Leilão';
      default:
        return 'Desconhecido';
    }
  };

  const formatTime = (value: any) => {
    if (typeof value === 'number') {
      const utcDate = new Date((value - 25569) * 86400 * 1000);
      utcDate.setHours(utcDate.getHours() + 3);
      utcDate.setMinutes(utcDate.getMinutes() + 7);

      return utcDate.toLocaleTimeString('pt-BR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) return 'Hora inválida';
    return parsed.toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const handleExportLeilao = () => {
  const veiculosLeilao = vehicles.filter(v => v.status === 'Disponível para Leilão');

  if (veiculosLeilao.length === 0) {
    alert('Nenhum veículo disponível para leilão encontrado.');
    return;
  }

  // Transforma os dados em um formato plano para exportação
  const exportData = veiculosLeilao.map(v => ({
    'Placa': v.plate,
    'Modelo': v.model,
    'Ano': v.year,
    'Cor': v.color,
    'Local da Apreensão': v.location,
    'Data da Remoção': formatDate(v.lastUpdate),
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leilao');

  XLSX.writeFile(workbook, 'Relatorio_Leilao.xlsx');
};


  const formatDate = (value: any) => {
    if (typeof value === 'number') {
      const correctedDate = new Date((value - 25568) * 86400 * 1000);
      return correctedDate.toLocaleDateString('pt-BR');
    }
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? 'Data inválida' : parsed.toLocaleDateString('pt-BR');
  };

  const formatDateTime = (value: any) => {
    if (typeof value === 'number') {
      const utcDate = new Date((value - 25569) * 86400 * 1000);
      utcDate.setHours(utcDate.getHours() + 3);
      return utcDate.toLocaleString('pt-BR');
    }
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? 'Data inválida' : parsed.toLocaleString('pt-BR');
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Veículos no Pátio</h2>
          <p className="text-lg text-gray-600">Visualize todos os veículos em nosso pátio em tempo real!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-700 mb-2">
              {vehicles.filter((v) => v.status === 'No patio').length + vehicles.filter((v) => v.status === 'Disponível para Leilão').length}
            </div>
            <div className="text-blue-600 font-medium">Total de Veículos no Pátio.</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-700 mb-2">
              {vehicles.filter((v) => v.status === 'No patio').length}
            </div>
            <div className="text-green-600 font-medium">Veículos dentro do prazo do Pátio.</div>
          </div>
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-700 mb-2">
              {vehicles.filter((v) => v.status === 'Disponível para Leilão').length}
            </div>
            <div className="text-red-600 font-medium">Veículos dísponiveis para Leilão.</div>
          </div>
        </div>
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Buscar por placa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            className="w-full md:w-1/3 p-3 border border-blue-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleExportLeilao}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 text-sm rounded-md shadow transition"
          >
            Exportar Leilão
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles
            .filter((vehicle) => vehicle.plate.toUpperCase().includes(searchTerm.toUpperCase()))
            .map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-blue-600" />
                    <span className="font-bold text-lg text-gray-900">{vehicle.plate}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      vehicle.status,
                    )}`}
                  >
                    {getStatusText(vehicle.status)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{vehicle.model}</h3>
                    <p className="text-sm text-gray-600">
                      {vehicle.year} • {vehicle.color}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{vehicle.location}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Data da Remoção: {formatDate(vehicle.lastUpdate)}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Info className="h-4 w-4" />
                    <span>Ver Detalhes</span>
                  </button>

                  <button
                    onClick={() => console.log('Outra ação', vehicle)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    Liberar Veículo
                  </button>
                </div>
              </div>
            ))}
      </div>

        {selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-3xl overflow-y-auto max-h-[80vh]">
              <h3 className="text-xl font-bold mb-4">Detalhes do Veículo</h3>
              <table className="w-full text-sm text-left">
                <tbody>
                  {Object.entries(selectedVehicle.fullDetails).map(([key, value]) => {
                    let displayValue = value;
                    if (key === 'Data da Remoção') displayValue = formatDate(value);
                    else if (key === 'Carimbo de data/hora') displayValue = formatDateTime(value);
                    else if (key === 'Horário da Apreensão') displayValue = formatTime(value);

                    return (
                      <tr key={key} className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-semibold text-gray-700 w-1/3">{key}</td>
                        <td className="py-2 text-gray-900">{displayValue}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button
                className="mt-6 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                onClick={() => setSelectedVehicle(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
