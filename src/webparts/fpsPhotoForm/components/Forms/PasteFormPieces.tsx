import * as React from 'react';

import styles from '../FpsPhotoForm.module.scss';
import { getButtonStyles } from './getButtonStyles';
import { IPhotoFormInput } from './PasteFormForm';

export function categoryButtons( CatNum: number, categoryX: number[], formProps: IPhotoFormInput, handleCategoryXClick: (cat: number ,index: number, ) => void  ): JSX.Element {
  const CategoryXs: string[] = formProps[ `Category${CatNum}s` as 'Category1s' ] ; // CatNum ? formProps.Category2s : formProps.Category3s;
  const className: string = styles[ `category${CatNum}` as 'category1'];
  const ele: JSX.Element = <div style={{ marginLeft: '1em' }} className={ className }>
    <h4 style={{ margin: '0px' }}>Category {CatNum}</h4>
    <div className={ styles.categoryButtons } style={{  }}>
      {CategoryXs.map((category, idx) => (
        <button
          className={categoryX.indexOf(idx) > -1 ?  [ styles.button, styles.selected ].join(' ') : styles.button }
          key={idx}
          title={ category }
          type="button"
          onClick={() => handleCategoryXClick( CatNum, idx)}
          style={ {...{  }, ...getButtonStyles( CategoryXs[ idx ], formProps.miscFormProps.photoButtonStyles ) } }
        >
          {category}
        </button>
      ))}
    </div>
  </div>;

  return ele;

}