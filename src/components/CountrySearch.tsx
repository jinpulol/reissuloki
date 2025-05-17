import React from 'react';

interface CountrySearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
  regions: string[];
  onSearch: (e: React.FormEvent) => void;
  loading: boolean;
}

const CountrySearch: React.FC<CountrySearchProps> = ({
  searchTerm,
  setSearchTerm,
  selectedRegion,
  setSelectedRegion,
  regions,
  onSearch,
  loading
}) => {
  return (
    <form onSubmit={onSearch} className="filter-form">
      <div className="form-group">
        <label htmlFor="search-term">Hae maan tai pääkaupungin nimellä:</label>
        <input
          id="search-term"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Hae englannin kielisillä nimillä, esim. Finland tai London"
        />
      </div>
      <div className="form-group">
        <label htmlFor="region-select">Suodata maanosan mukaan:</label>
        <select
          id="region-select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">Kaikki maanosat</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Haetaan...' : 'Hae / Suodata'}
      </button>
    </form>
  );
};

export default CountrySearch;
