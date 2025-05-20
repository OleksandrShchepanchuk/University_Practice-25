import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { loadFavourites } from '../../store/slices/favouriteSlice';
import MoviesView from '../../components/Movies/MoviesView/MoviesView';
import './Favourites.scss';
import Loader from '../../components/common/Loader/Loader';

const Favourites: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: favourites, loading, error, hasLoaded } = useSelector(
    (state: RootState) => state.favourites
  );

  useEffect(() => {
    if (!hasLoaded) {
      dispatch(loadFavourites());
    }
  }, [dispatch, hasLoaded]);

  return (
    <div className="favourites-page">
      <div className="favourites-page__background" />
      <div className="favourites-page__content">
        <div className="favourites-page__container">
          <h2 className="favourites-page__title">Обрані фільми</h2>
          <div className="favourites-page__line"></div>

          {favourites.length > 0 ? (
            <MoviesView
              title=""
              movies={favourites}
              loading={loading}
              error={error}
              variant="default"
            />
          ) : loading ? (<Loader/>) : (
            <div className="favourites-page__empty">Список обраних порожній</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favourites;